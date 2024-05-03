import type { Access } from 'payload/config'

import { isSuperAdmin } from '../../../utils/isSuperAdmin'
import { checkUserRoles } from '../../../utils/checkUserRoles'

import { USER_ROLES } from '../../../constants/roles/userRoles';
import { TENANT_ROLES } from '../../../constants/roles/tenantRoles';

// the user must be an admin of the tenant being accessed
export const tenantManagers: Access = ({ req: { user } }) => {
  if (isSuperAdmin(user)) {
    return true
  }

  if (!checkUserRoles([USER_ROLES.TENANT_MANAGER], user)) {
    return false;
  }

  return {
    id: {
      in:
        user?.tenants
          ?.map(({ tenant, roles }) =>
            roles.includes(TENANT_ROLES.ADMIN) ? (typeof tenant === 'string' ? tenant : tenant.id) : null,
          ) // eslint-disable-line function-paren-newline
          .filter(Boolean) || [],
    },
  }
}
