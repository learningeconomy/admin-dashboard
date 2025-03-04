import type { VC, VP } from '@learncard/types';
import type { PayloadRequest } from 'payload/dist/types'

import payload from 'payload';
import { Credential, Membership } from '../../payload-types';

import getCredentialLinksExternal from './external/getCredentialLinks';
import getCredentialLinksInternal from './internal/getCredentialLinks';

import exchangeExternal from './external/exchange';
import exchangeInternal from './internal/exchange';

import revokeExternal from './external/revoke';
import revokeInternal from './internal/revoke';

const logs = true;

export const hasExternalCoordinator = (): boolean => {
    return process.env.COORDINATOR_URL?.includes('http') || false;
}

export const hasExternalStatusList = (): boolean => {
    return process.env.STATUS_URL?.includes('http') || false;
}

export const getCredentialLinks = async (req: PayloadRequest, id: string, collection: 'credential' | 'membership', token: string, domain: string) => {
    const credential = await payload.findByID({ id, collection, depth: 3 });

    if (
        typeof credential?.batch === 'string' ||
        typeof credential.batch.template === 'string' ||
        !credential.batch.template.credentialTemplateJson
    ) {
        return null;
    }

    if (logs) console.log(`[Get Credential Links] - External (${hasExternalCoordinator()}) - ID (${id}) - Collection (${collection})`, token)

    if (hasExternalCoordinator()) {
        return getCredentialLinksExternal(credential, id, collection, token, domain);
	} else {
        return getCredentialLinksInternal(credential, collection, token, domain);
	}
};



export const exchange = async (req: PayloadRequest, collection: "membership" | "credential", credentialId: string, retrievalId: string, challenge: string, didAuthVP: VP): Promise<number | VC> => {
    if (logs) console.log(`[Exchange] - External (${hasExternalCoordinator()}) - ID (${credentialId}) - challenge (${challenge})`, retrievalId, didAuthVP)
	if (hasExternalCoordinator()) {
	    return exchangeExternal(req, collection, credentialId, retrievalId, challenge, didAuthVP);
	} else {
        return exchangeInternal(req, collection, credentialId, retrievalId, challenge, didAuthVP);
	}
}

export const revoke = async (req: PayloadRequest, credentialId: string, revocationReason: string, userId: string): Promise<{ status: number, result?: JSON, error?: any}> => {
    if (logs) console.log(`[Revoke] - External (${hasExternalStatusList()}) - ID (${credentialId}) - User (${userId})`, revocationReason)
    if (hasExternalStatusList()) {
        return revokeExternal(req, credentialId, revocationReason, userId);
    } else {
        return revokeInternal(req, credentialId, revocationReason, userId);
    }
}


