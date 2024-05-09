import { PayloadHandler } from 'payload/config';
import { checkPermissionToRevokeCredential } from '../utils/checkPermissionToRevokeCredential';

import { revoke } from '../helpers/issuerCoordinator';

export const revokeCredential: PayloadHandler = async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    // TODO: Add Multi-Tenancy Permissions

    const { id } = req.params;
    const { reason } = req.body;

    if (!(await checkPermissionToRevokeCredential(req.user, id))) {
        return res.sendStatus(401);
    }

    try {
        const revokeAttempt = await revoke(id, reason, req?.user?.id);

        if (revokeAttempt.error) {
            console.error(revokeAttempt.error);
            res.sendStatus(revokeAttempt.status);
        }

        res.status(revokeAttempt.status).json(revokeAttempt.result);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};