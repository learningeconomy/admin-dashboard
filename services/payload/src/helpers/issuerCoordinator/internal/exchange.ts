import type { VP, VC, UnsignedVC } from '@learncard/types';
import type { PayloadRequest } from 'payload/dist/types'
import payload from 'payload';
import { areDidsEqual, getLearnCard } from '../../../helpers/learncard.helpers';

import { insertValuesIntoHandlebarsJsonTemplate } from '../../../helpers/handlebarhelpers';
import { inflateObject } from '../../../helpers/objects.helpers';
import { getTemplateAssociatedWithMembership } from '../../../helpers/membership.helpers';
import { issueCredentialViaTenantIdentity } from '../../../helpers/signingIdentity.helpers';

import { CREDENTIAL_STATUS } from '../../../constants/credentials';

import { getDelCredentialIdForChallenge } from './challenges';

const exchange = async (
	req: PayloadRequest,
	collection: 'membership' | 'credential',
	credentialId: string,
	retrievalId: string,
	challenge: string,
	didAuthVP: VP
): Promise<number | VC> => {
	try {
		const learnCard = await getLearnCard();

		// Verify DID-Auth VP
		const result = await learnCard.invoke.verifyPresentation(didAuthVP);

		// If invalid, return forbidden status
		if (result.errors.length > 0) {
			return 401;
		}

		const did = didAuthVP.holder;

		const credentialIdStoredForChallenge = await getDelCredentialIdForChallenge(
			didAuthVP?.proof?.challenge
		);

		// If challenge fails, return forbidden status
		if (!credentialIdStoredForChallenge || !(credentialIdStoredForChallenge === credentialId)) {
			return 401;
		}

		const credential = await payload.findByID({ id: credentialId, collection, depth: 3 });

		if (
			typeof credential?.batch === 'string' ||
			typeof credential.batch.template === 'string' ||
			!credential.batch.template.credentialTemplateJson
		) {
			return 404;
		}

		let builtCredential = insertValuesIntoHandlebarsJsonTemplate(
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

		// If issuing a membership, make the ID the ID of the membership template.
		if (collection === 'membership') {
			const membershipTemplate = (await getTemplateAssociatedWithMembership(credentialId))?.docs?.[0];
			if (membershipTemplate) builtCredential.id = membershipTemplate?.id;
		}	

		if (typeof builtCredential?.issuer === 'string') builtCredential.issuer = {};
		builtCredential.issuer.id = learnCard.id.did();

		if (!builtCredential.credentialSubject) builtCredential.credentialSubject = {};
		if (Array.isArray(builtCredential.credentialSubject)) {
			builtCredential.credentialSubject = builtCredential.credentialSubject.map(subject => ({
				...subject,
				id: did,
			}));
		} else {
			builtCredential.credentialSubject.id = did;
		}

		if (!builtCredential.issuanceDate) {
			builtCredential.issuanceDate = new Date().toISOString();
		}

		// TODO: Add Status List revocation into credential

		// Sign VC
		const issuedCredential = credential?.tenant
                    ? await issueCredentialViaTenantIdentity(credential.tenant, builtCredential, req)
                    : await learnCard.invoke.issueCredential(builtCredential)

		// Update VC Status to claimed
		await payload.update({
			collection,
			id: credentialId,
			data: {
				status: CREDENTIAL_STATUS.CLAIMED,
				...(collection === 'membership'
					? { targetDid: builtCredential?.credentialSubject?.id }
					: {}),
			},
			req,
		});

		// Return Credential
		return issuedCredential;
	} catch (e) {
		console.error(e);
		return 500;
	}
};

export default exchange;