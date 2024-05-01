import type { Access } from 'payload/config'

import { checkUserRoles } from '../../../utils/checkUserRoles'
import isDraftState from '../utilities/isDraftState';

// the user must be an admin of the document's tenant
export const tenantAdmins: Access = async ({ req: { user }, id }) => {

  // TODO: THIS IS SPECIFIALLY ALLOWING SUPER ADMINS TO EDIT REGARDLESS of DRAFT STATE
  if (checkUserRoles(['super-admin'], user)) {
    return true
  }

  if (!(await isDraftState(id))) {
    return false;
  }

  return {
    tenant: {
      in:
        user?.tenants
          ?.map(({ tenant, roles }) =>
            roles.includes('admin') ? (typeof tenant === 'string' ? tenant : tenant.id) : null,
          ) // eslint-disable-line function-paren-newline
          .filter(Boolean) || [],
    },
  }
}