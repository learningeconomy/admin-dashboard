import { PayloadHandler } from 'payload/config';
import payload from 'payload';
import { CREDENTIAL_STATUS } from '../../../constants/credentials';

const revoke = async (credentialId: string, revocationReason: string, userId: string): Promise<{ status: number, result?: JSON, error?: any}> => {
    try {

        // Revoke Credential using Status List
        console.warn("Psuedo-revoking credential: ", credentialId, ". Please implement StatusList2021");

        // TODO: Check successful verification. 
        await payload.update({
            collection: 'credential',
            id: credentialId,
            data: {
                status: CREDENTIAL_STATUS.REVOKED,
                revocationReason,
                revocationDate: new Date().toISOString(),
                revokedBy: userId,
            },
        });

        // TODO: Return revocation result
        return {
            status: 200
        }

    } catch (error) {
        console.error(error);
        return {
            status: 500,
            error
        }
    }
};

export default revoke;