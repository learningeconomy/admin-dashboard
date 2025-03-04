import { PayloadHandler } from 'payload/config';
import payload from 'payload';
import { CREDENTIAL_STATUS } from '../../../constants/credentials';

const statusUrl = process.env.STATUS_URL ?? 'http://localhost:4008';

const revoke = async (req: PayloadRequest, credentialId: string, revocationReason: string, userId: string): Promise<{ status: number, result?: JSON, error?: any}> => {
    try {
        const fetchResponse = await fetch(`${statusUrl}/credentials/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                credentialId,
                credentialStatus: [{ type: 'StatusList2021Credential', status: 'revoked' }],
            }),
        });

        if (fetchResponse.status === 200) {
            await payload.update({
                collection: 'credential',
                id: credentialId,
                data: {
                    status: CREDENTIAL_STATUS.REVOKED,
                    revocationReason,
                    revocationDate: new Date().toISOString(),
                    revokedBy: userId,
                },
                req
            });
        }

        const result = await fetchResponse.json();

        return {
            status: fetchResponse.status,
            result
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