import type { UnsignedVC, VC } from '@learncard/types';
import payload from 'payload';
import { Credential, Membership } from '../../../payload-types';

import { insertValuesIntoHandlebarsJsonTemplate } from '../../../helpers/handlebarhelpers';
import { inflateObject } from '../../../helpers/objects.helpers';

import { CREDENTIAL_STATUS } from '../../../constants/credentials';

const coordinatorUrl = process.env.COORDINATOR_URL ?? 'http://localhost:4005';

const tenantName = process.env.TENANT_NAME ?? 'test';

const getCredentialLinks = async (credential: Credential | Membership, retrievalId: string, collection: 'credential' | 'membership', token: string, domain: string) => {
    const builtCredential = insertValuesIntoHandlebarsJsonTemplate(
        JSON.stringify(credential.batch.template.credentialTemplateJson),
        {
            ...(inflateObject as any)(credential.extraFields as any),
            ...(collection === 'membership'
                ? {}
                : { credentialName: credential.credentialName }),
            earnerName: credential.earnerName,
            emailAddress: credential.emailAddress,
            now: new Date().toISOString(),
            issuanceDate: new Date().toISOString(),
        }
    ) as any as UnsignedVC;

    // Prep for sending to signing service
    builtCredential.id = collection === 'membership' ? credential.batch.template.id : retrievalId;
    if (typeof builtCredential?.issuer === 'string') builtCredential.issuer = {};
    if ('id' in (builtCredential?.issuer ?? {})) delete builtCredential.issuer.id;

    const fetchResponse = await fetch(`${coordinatorUrl}/exchange/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            data: [{ vc: builtCredential, retrievalId }],
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

    const updatedResults = results.map(result => {
        const deepLinkUrl = new URL(result.directDeepLink);

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
        };
    });

    return {
        links: updatedResults,
        metadata: {
            credentialName:
                collection === 'credential'
                    ? credential.credentialName
                    : credential.batch.template.title,
            earnerName: credential.earnerName,
            awardedDate: credential.updatedAt,
            issuedDate: new Date().toISOString(),
        },
    };
};

export default getCredentialLinks;

