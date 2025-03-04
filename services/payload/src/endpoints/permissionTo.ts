import { PayloadHandler } from 'payload/config';

import { CUSTOM_OPERATIONS } from '../constants/roles/customOperations';
import { checkPermissionToRevokeCredential } from '../utils/checkPermissionToRevokeCredential';
import { checkPermissionToIssueCredentials } from '../utils/checkPermissionToIssueCredentials';

export const permissionTo: PayloadHandler = async (req, res) => {
    const { id, operation } = req.params;
    try {
        switch(operation) {
            case CUSTOM_OPERATIONS.REVOKE_CREDENTIAL:
                res.status(200).json({
                    credentialId: id,
                    operation,
                    permission: await checkPermissionToRevokeCredential(req.user, id),
                });
                break;
            case CUSTOM_OPERATIONS.ISSUE_CREDENTIALS:
                res.status(200).json({
                    operation,
                    permission: await checkPermissionToIssueCredentials(req),
                });
                break;
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ version: undefined });
    }
};