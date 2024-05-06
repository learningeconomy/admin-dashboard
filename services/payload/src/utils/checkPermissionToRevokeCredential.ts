import { PayloadHandler } from 'payload/config';
import payload from 'payload';
import { User } from '../payload-types';
import { CREDENTIAL_STATUS } from '../constants/credentials';
import { TENANT_ROLES } from '../constants/roles/tenantRoles';
import { checkTenantRoles } from '../collections/Users/utilities/checkTenantRoles';
import { isSuperAdmin } from '../utils/isSuperAdmin';

const statusUrl = process.env.STATUS_URL ?? 'http://localhost:4008';

/**
 * Only Allow a super admin, or a user with the Revocation Manager permisson on the tenant associated with the credential
 **
 */
export const checkPermissionToRevokeCredential = async (
    user: User | undefined,
    credentialId: string
): Promise<boolean> => {
    if (!user) return false;

    if (isSuperAdmin(user)) {
        return true;
    }

    const credential = await payload.findByID({
        collection: 'credential',
        id: credentialId,
        depth: 2,
        showHiddenFields: true,
    });
    const credentialTenant = credential?.tenant;
    const credentialTenantId =
        typeof credentialTenant === 'string' ? credentialTenant : credentialTenant?.id;

    if (checkTenantRoles([TENANT_ROLES.REVOCATION_MANAGER], user, credentialTenantId)) {
        return true;
    }

    return false;
};