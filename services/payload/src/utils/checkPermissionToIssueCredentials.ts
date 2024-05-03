import { PayloadRequest } from 'payload/dist/types';
import { TENANT_ROLES } from '../constants/roles/tenantRoles';
import getTenantForRequest from './getTenantForRequest';
import { checkTenantRoles } from '../collections/Users/utilities/checkTenantRoles';
import { isSuperAdmin } from '../utils/isSuperAdmin';

/**
 * Only Allow a super admin, or a user with the issue credentials role
 **
 */
export const checkPermissionToIssueCredentials = async (req: PayloadRequest): Promise<boolean> => {
    const { user } = req;
    if (!user) return false;

    if (isSuperAdmin(user)) {
        return true;
    }

    const tenant = await getTenantForRequest(req)
    const tenantId =
        typeof tenant === 'string' ? tenant : tenant?.id;

    if (checkTenantRoles([TENANT_ROLES.ISSUER], req.user, tenantId)) {
        return true;
    }

    return false;
};