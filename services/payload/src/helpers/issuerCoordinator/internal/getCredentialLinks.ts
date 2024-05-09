import type { VC } from '@learncard/types';

import { Credential, Membership } from '../../../payload-types';

import { generateAndStoreChallengeForCredentialId } from './challenges';

const deepLinkHost = process.env.DEEP_LINK_HOST ?? 'https://lcw.app/request.html';


const getCredentialLinks = async (credential: Credential | Membership, collection: 'credential' | 'membership', token: string, domain: string) => {
    const id = credential?.id;
	const challenge = await generateAndStoreChallengeForCredentialId(id);
	// TODO replace with learncard issuer
	const issuer = 'issuer.example.com';
	const serviceEndpoint = `${domain}/api/exchange/${id}/${challenge}/${token}`;

	return {
		links: [{
			retrievalId: credential?.id,
			directDeepLink: `${deepLinkHost}?issuer=${issuer}&auth_type=bearer&challenge=${challenge}&vc_request_url=${serviceEndpoint}`,
			vprDeepLink: `${deepLinkHost}?issuer=${issuer}&auth_type=bearer&vc_request_url=${serviceEndpoint}`,
			chapiVPR: {
				query: {
					type: "DIDAuthentication"
				},
				interact: {
					service: [{
						type: "VerifiableCredentialApiExchangeService",
						serviceEndpoint,
					}, {
						type: "CredentialHandlerService"
					}]
				},
				challenge,
				domain
			}
		}],
		metadata: {
			credentialName: collection === 'credential'
                    ? credential.credentialName
                    : credential.batch.template.title,
            earnerName: credential.earnerName,
            awardedDate: credential.updatedAt,
            issuedDate: new Date().toISOString()
		}
	}
};

export default getCredentialLinks;

