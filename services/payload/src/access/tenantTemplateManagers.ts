import type { Access } from 'payload/config'

import { checkUserRoles } from '../utils/checkUserRoles'
import { checkTenantRoles } from '../collections/Users/utilities/checkTenantRoles';
import { TENANT_ROLES } from '../constants/roles/tenantRoles';

import getTenantForRequest from '../utils/getTenantForRequest'

// the user must be an template manager of the document's tenant
export const tenantTemplateManagers: Access = async ({ req }) => {
  const { user } = req;
  if (checkUserRoles(['super-admin'], user)) {
    return true
  }

  const tenant = await getTenantForRequest(req);
  const tenantId = typeof tenant === 'string' ? tenant : tenant?.id
  if(!checkTenantRoles([TENANT_ROLES.TEMPLATE_MANAGER], user, tenantId)) {
    return false;
  }

  return {
    tenant: {
      in:
        user?.tenants
          ?.map(({ tenant, roles }) =>
            roles.includes(TENANT_ROLES.TEMPLATE_MANAGER) ? (typeof tenant === 'string' ? tenant : tenant.id) : null,
          ) // eslint-disable-line function-paren-newline
          .filter(Boolean) || [],
    },
  }
}
