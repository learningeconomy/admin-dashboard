import type { UnsignedVC } from '@learncard/types';
import { PayloadHandler } from 'payload/config';
import payload from 'payload';
import jwt from 'jsonwebtoken';
import { insertValuesIntoHandlebarsJsonTemplate } from '../helpers/handlebarhelpers';

const coordinatorUrl = process.env.COORDINATOR_URL ?? 'http://localhost:4005';
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

        if (
            typeof credential?.batch === 'string' ||
            typeof credential.batch.template === 'string' ||
            !credential.batch.template.credentialTemplateJson
        ) {
            return res.sendStatus(404);
        }

        const builtCredential = insertValuesIntoHandlebarsJsonTemplate(
            JSON.stringify(credential.batch.template.credentialTemplateJson),
            {
                ...(credential.extraFields as any),
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

        const fetchResponse = await fetch(`${coordinatorUrl}/exchange/setup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: [{ vc: builtCredential, retrievalId: id }],
                tenantName: 'test',
            }),
        });

        const results = (await fetchResponse.json()) as {
            retrievalId: string;
            directDeepLink: string;
            vprDeepLink: string;
            chapiVPR: {
                challenge: string;
                domain: string;
                interact: {
                    service: [{ serviceEndpoint: string; type: string }, { type: string }];
                };
                query: { type: string };
            };
        }[];

        const updatedResults = results.map(result => {
            const url = new URL(result.directDeepLink);

            const requestUrl = url.searchParams.get('vc_request_url');

            url.searchParams.set('vc_request_url', `${requestUrl}/${token}`);
            url.search = decodeURIComponent(url.search);

            return { ...result, directDeepLink: url.toString() };
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
