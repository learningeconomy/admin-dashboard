import payload from 'payload';
import jwt from 'jsonwebtoken';
import { PayloadHandler } from 'payload/config';
import { insertValuesIntoHandlebarsJsonTemplate } from '../helpers/handlebarhelpers';
import type { UnsignedVC } from '@learncard/types';
import { areDidsEqual, getLearnCard } from '../helpers/learncard.helpers';
import getRedis from '../helpers/redis.helpers';
import { inflateObject } from '../helpers/objects.helpers';

export const selfIssueUserCredentials: PayloadHandler = async (req, res) => {
    const { authorization } = req.headers;

    if (!authorization) return res.sendStatus(401);

    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer') return res.sendStatus(401);

    const learnCard = await getLearnCard();

    const result = await learnCard.invoke.verifyPresentation(token, { proofFormat: 'jwt' });

    if (result.errors.length > 0) {
        return res.status(400).send('Invalid DID Auth VP');
    }

    const decoded = jwt.decode(token);

    if (typeof decoded === 'string' || !decoded?.vp?.holder || !decoded?.nonce) {
        return res.sendStatus(500);
    }

    const did = decoded.vp.holder;

    const redis = getRedis();
    const didStoredForChallenge = await redis.getdel(`challenge:${decoded.nonce}`);

    if (!didStoredForChallenge || !(await areDidsEqual(didStoredForChallenge, did))) {
        return res.sendStatus(401);
    }

    const { ids } = req.body;

    const credential = await payload.find({
        collection: 'credential',
        where: { id: { in: ids } },
        depth: 3,
        pagination: false,
    });

    const credentials = credential.docs;

    const builtCredentials = credentials
        .map(credential => {
            if (
                typeof credential?.batch === 'string' ||
                typeof credential.batch.template === 'string' ||
                !credential.batch.template.credentialTemplateJson
            ) {
                return undefined as any as UnsignedVC;
            }

            const builtCredential = insertValuesIntoHandlebarsJsonTemplate(
                JSON.stringify(credential.batch.template.credentialTemplateJson),
                {
                    ...(inflateObject as any)(credential.extraFields as any),
                    credentialName: credential.credentialName,
                    earnerName: credential.earnerName,
                    emailAddress: credential.emailAddress,
                    now: new Date().toISOString(),
                    issuanceDate: new Date().toISOString(),
                }
            ) as any as UnsignedVC;

            // Prep for sending to signing service
            builtCredential.id = credential.id;
            if (typeof builtCredential?.issuer === 'string') builtCredential.issuer = {};
            builtCredential.issuer.id = learnCard.id.did();

            if (!builtCredential.credentialSubject) builtCredential.credentialSubject = {};
            if (Array.isArray(builtCredential.credentialSubject)) {
                builtCredential.credentialSubject = builtCredential.credentialSubject.map(
                    subject => ({
                        ...subject,
                        id: did,
                    })
                );
            } else {
                builtCredential.credentialSubject.id = did;
            }

            if (!builtCredential.issuanceDate) {
                builtCredential.issuanceDate = new Date().toISOString();
            }

            return builtCredential;
        })
        .filter(Boolean);

    try {
        const issuedCreds = await Promise.all(
            builtCredentials.map(uvc => learnCard.invoke.issueCredential(uvc))
        );

        res.status(200).json(issuedCreds);
    } catch (error) {
        console.error(error);

        return res.sendStatus(500);
    }
};
