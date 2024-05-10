import { PayloadHandler } from 'payload/config';
import payload from 'payload';
import { User } from '../payload-types';
import { CREDENTIAL_STATUS } from '../constants/credentials';
import { TENANT_ROLES } from '../constants/roles/tenantRoles';
import { checkTenantRoles } from '../collections/Users/utilities/checkTenantRoles';
import { isSuperAdmin } from '../utils/isSuperAdmin';

/**
 * Only Allow a super admin, or a user with the Revocation Manager permisson on the tenant associated with the credential
 **
 */
export const checkPermissionToRevokeCredential = async (
    user: User | undefined,
    credentialId: string | undefined
): Promise<boolean> => {
    if (!user) return false;
    if (!credentialId) return false;

    if (isSuperAdmin(user)) {
        return true;
    }

    try {
        const credentialDocs = await payload.find({
            collection: 'credential',
            where: {
                id: {
                   equals: credentialId
                }
            },
            depth: 2,
            showHiddenFields: true,
        });

        if (credentialDocs.totalDocs === 0) {
            return false;
        }

        const credential = credentialDocs.docs?.[0];

        const credentialTenant = credential?.tenant;
        const credentialTenantId =
            typeof credentialTenant === 'string' ? credentialTenant : credentialTenant?.id;

        if (checkTenantRoles([TENANT_ROLES.REVOCATION_MANAGER], user, credentialTenantId)) {
            return true;
        }

    } catch (e) { 
        console.error(e);
    }

    return false;
};