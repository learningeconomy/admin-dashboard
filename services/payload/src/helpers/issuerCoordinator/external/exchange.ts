import type { VC, VP } from '@learncard/types';
import payload from 'payload';

import { CREDENTIAL_STATUS } from '../../../constants/credentials';

const coordinatorUrl = process.env.COORDINATOR_URL ?? 'http://localhost:4005';

const tenantName = process.env.TENANT_NAME ?? 'test';

const exchange = async (req: PayloadRequest, collection: string, credentialId: string, retrievalId: string, challenge: string, didAuthVP: VP): Promise<number | VC> => {

    const response = await fetch(`${coordinatorUrl}/exchange/${retrievalId}/${challenge}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(didAuthVP),
    });

    if (response.status !== 200) return response.status;
    const credential = (await response.json()) as VC;

    if (credential?.credentialStatus?.id) {
        await payload.update({
            collection,
            id: credentialId,
            data: {
                status: CREDENTIAL_STATUS.CLAIMED,
                ...(collection === 'membership'
                    ? { targetDid: credential.credentialSubject.id }
                    : {}),
            },
            req,
        });
    }

    return credential;


}

export default exchange;