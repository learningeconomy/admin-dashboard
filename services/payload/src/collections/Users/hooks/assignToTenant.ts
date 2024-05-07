import type { AfterChangeHook } from 'payload/dist/collections/config/types';
import getTenantForRequest from '../../../utils/getTenantForRequest';
import { TENANT_ROLES } from '../../../constants/roles/tenantRoles';
import { USER_ROLES } from '../../../constants/roles/userRoles';

// Assign user to tenant with basic roles
export const assignToTenant: AfterChangeHook = async ({
    doc,
    req,
    req: { payload, body = {}, res },
    operation,
}) => {
    if (operation === 'create' && req.user) {
        const tenant = await getTenantForRequest(req);
        const tenantId = typeof tenant === 'string' ? tenant : tenant?.id;

        // If the user is creating this user within a tenant, add the user to the tenant with minimum roles.
        if (tenantId) {
            await req.payload.update({
                id: doc.id,
                collection: 'users',
                data: {
                    roles: [USER_ROLES.USER],
                    tenants: [
                        {
                            tenant: tenantId,
                            roles: [TENANT_ROLES.ADMIN, TENANT_ROLES.USER],
                        },
                    ],
                    lastLoggedInTenant: tenantId,
                },
                req,
            });
        } else {
            await req.payload.update({
                id: doc.id,
                collection: 'users',
                data: {
                    roles: [USER_ROLES.USER],
                },
                req,
            });
        }
    }

    return doc;
};