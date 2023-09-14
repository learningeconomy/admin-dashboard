import { PayloadHandler } from 'payload/config';
import payload from 'payload';

export const revokeCredential: PayloadHandler = async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const { id } = req.params;

    try {
        const fetchResponse = await fetch('http://localhost:4008/credentials/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                credentialId: id,
                credentialStatus: [{ type: 'StatusList2021Credential', status: 'revoked' }],
            }),
        });

        const result = await fetchResponse.json();

        await payload.update({ collection: 'credential', id, data: { status: 'REVOKED' } });

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};
