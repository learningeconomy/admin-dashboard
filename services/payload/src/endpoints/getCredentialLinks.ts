import type { UnsignedVC } from '@learncard/types';
import { PayloadHandler } from 'payload/config';
import payload from 'payload';
import jwt from 'jsonwebtoken';
import { insertValuesIntoHandlebarsJsonTemplate } from '../helpers/handlebarhelpers';

const secret =
    process.env.PAYLOAD_SECRET ??
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabaaaaaaaaaaaaaaaaaaaa';

export const getCredentialLinks: PayloadHandler = async (req, res) => {
    let id: string;

    const authHeader = req.headers.authorization;

    if (!authHeader.startsWith('Bearer ')) return res.sendStatus(401);

    const token = authHeader.split('Bearer ')[1];

    try {
        const decoded = jwt.verify(token, secret);

        if (typeof decoded === 'string' || !decoded.id) return res.sendStatus(401);

        id = decoded.id;
    } catch (error) {
        return res.sendStatus(401);
    }

    try {
        const credential = await payload.findByID({ id, collection: 'credential', depth: 3 });

        if (!credential?.batch?.template?.credentialTemplateJson) return res.sendStatus(404);

        const builtCredential = insertValuesIntoHandlebarsJsonTemplate(
            JSON.stringify(credential.batch.template.credentialTemplateJson),
            {
                ...credential.extraFields,
                credentialName: credential.credentialName,
                earnerName: credential.earnerName,
                emailAddress: credential.emailAddress,
                now: new Date().toISOString(),
                issuanceDate: credential.updatedAt,
            }
        ) as any as UnsignedVC;

        // Prep for sending to signing service
        builtCredential.id = id;
        if (typeof builtCredential?.issuer === 'string') builtCredential.issuer = {};
        if ('id' in (builtCredential?.issuer ?? {})) delete builtCredential.issuer.id;

        const fetchResponse = await fetch('http://localhost:4005/exchange/setup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vc: builtCredential, tenantName: 'test' }),
        });

        const results = (await fetchResponse.json()) as { type: string; url: string }[];

        const updatedResults = results.map(result => {
            const url = new URL(result.url);

            const requestUrl = url.searchParams.get('vc_request_url');

            url.searchParams.set('vc_request_url', `${requestUrl}/${token}`);
            url.search = decodeURIComponent(url.search);

            return { ...result, url: url.toString() };
        });

        res.status(200).json({
            links: updatedResults,
            metadata: {
                credentialName: credential.credentialName,
                earnerName: credential.earnerName,
                awardedDate: credential.updatedAt,
                issuedDate: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};
