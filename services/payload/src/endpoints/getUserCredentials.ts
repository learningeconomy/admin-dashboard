import payload from 'payload';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { PayloadHandler } from 'payload/config';
import { areDidsEqual, getLearnCard } from '../helpers/learncard.helpers';
import { CREDENTIAL_STATUS } from '../constants/credentials';
import getRedis from '../helpers/redis.helpers';
import getTemplateAssociatedWithMembership from '../helpers/membership.helpers';

export const getUserCredentials: PayloadHandler = async (req, res) => {
    const { membership } = req.body;
    const { authorization } = req.headers;

    if (!authorization) return res.sendStatus(401);

    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer') return res.sendStatus(401);

    const learnCard = await getLearnCard();

    try {
        const result = await learnCard.invoke.verifyPresentation(token, { proofFormat: 'jwt' });

        if (result.errors.length > 0) {
            return res.status(400).send('Invalid DID Auth VP');
        }
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }

    const decoded = jwt.decode(token);

    if (typeof decoded === 'string' || !decoded?.vp?.holder) return res.sendStatus(500);

    if (!(await areDidsEqual(decoded.vp.holder, membership?.credentialSubject?.id))) {
        return res.sendStatus(401);
    }

    const issuedMembership = await payload.find({
        collection: 'membership',
        where: {
            targetDid: { equals: membership?.credentialSubject?.id },
            status: { not_equals: CREDENTIAL_STATUS.REVOKED },
        },
        depth: 0,
        limit: 1,
    });

    if (issuedMembership.totalDocs < 1) return res.sendStatus(401);


    let membershipTemplate = await payload.find({
        collection: 'membership-template',
        where: { id: { equals: membership?.id } },
        depth: 0,
    });

    /**
     *  If the credential doesn't have the template as an ID, find the template associated with the ID.
     * TODO: Update to match behavior of new memberships when that time comes.
     **/
    if (!membershipTemplate && membership?.id) {
        const template = await getTemplateAssociatedWithMembership(membership?.id)
        if (template) membershipTemplate = template;
    }

    const ids = membershipTemplate.docs.flatMap<string>(
        doc => (doc.associatedCredentials as string[]) ?? []
    );

    const challenge = crypto.randomBytes(32).toString('hex');

    const redis = getRedis();

    await redis.setex(`challenge:${challenge}`, 3600, decoded.vp.holder);

    return res.status(200).json({ ids, challenge });
};
