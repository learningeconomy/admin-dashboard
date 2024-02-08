import payload from 'payload';
import { PayloadHandler } from 'payload/config';
import { insertValuesIntoHandlebarsJsonTemplate } from '../helpers/handlebarhelpers';
import type { UnsignedVC } from '@learncard/types';
import { generateJwtFromId } from '../helpers/jwtHelpers';

const coordinatorUrl = process.env.COORDINATOR_URL ?? 'http://localhost:4005';
const tenantName = process.env.TENANT_NAME ?? 'test';

// TODO make sure to update credential status from sent

export const getCredentialsLinks: PayloadHandler = async (req, res) => {
    const { ids } = req.body;

    console.log({ ids });

    const mongoCredential = await payload.find({
        collection: 'credential',
        where: { id: { in: ids } },
        depth: 3,
    });

    console.log({ credential: mongoCredential });

    const credentials = mongoCredential.docs;

    const builtCredentials = credentials.map(credential => {
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
                issuanceDate: new Date().toISOString(),
            }
        ) as any as UnsignedVC;

        // Prep for sending to signing service
        builtCredential.id = credential.id;
        if (typeof builtCredential?.issuer === 'string') builtCredential.issuer = {};
        if ('id' in (builtCredential?.issuer ?? {})) delete builtCredential.issuer.id;

        return builtCredential;
    });

    const fetchResponse = await fetch(`${coordinatorUrl}/exchange/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            data: builtCredentials.map(credential => ({
                vc: credential,
                retrievalId: credential.id,
            })),
            tenantName,
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

    const updatedResults = results.map((result, index) => {
        const credential = credentials[index];
        const deepLinkUrl = new URL(result.directDeepLink);

        const token = generateJwtFromId(credential.id);

        const requestUrl = deepLinkUrl.searchParams.get('vc_request_url');

        deepLinkUrl.searchParams.set('vc_request_url', `${requestUrl}/${token}`);
        deepLinkUrl.search = decodeURIComponent(deepLinkUrl.search);

        const vprDeepLinkUrl = new URL(result.vprDeepLink);

        const vprRequestUrl = vprDeepLinkUrl.searchParams.get('vc_request_url');

        vprDeepLinkUrl.searchParams.set('vc_request_url', `${vprRequestUrl}/${token}`);
        vprDeepLinkUrl.search = decodeURIComponent(vprDeepLinkUrl.search);

        return {
            ...result,
            directDeepLink: deepLinkUrl.toString(),
            vprDeepLink: vprDeepLinkUrl.toString(),
            chapiVPR: {
                ...result.chapiVPR,
                interact: {
                    ...result.chapiVPR.interact,
                    service: [
                        {
                            ...result.chapiVPR.interact.service[0],
                            serviceEndpoint: `${result.chapiVPR.interact.service[0].serviceEndpoint}/${token}`,
                        },
                        ...result.chapiVPR.interact.service.slice(1),
                    ],
                },
            },
            metadata: {
                credentialName: credential.credentialName,
                earnerName: credential.earnerName,
                awardedDate: credential.updatedAt,
                issuedDate: new Date().toISOString(),
            },
        };
    });

    res.status(200).json(updatedResults);
};
