import type { FieldAccess } from 'payload/types'

import { isSuperAdmin } from '../../../utils/isSuperAdmin'
import { checkUserRoles } from '../../../utils/checkUserRoles'
import { checkTenantRoles } from '../utilities/checkTenantRoles'

import { USER_ROLES } from '../../../constants/roles/userRoles';
import { TENANT_ROLES } from '../../../constants/roles/tenantRoles';

export const tenantManagers: FieldAccess = args => {
  const {
    req: { user },
    doc,
  } = args

  if (isSuperAdmin(user)) {
    return true
  }

  if (!checkUserRoles([USER_ROLES.TENANT_MANAGER], user)) {
    return false;
  }

  return doc?.tenants?.some(({ tenant }) => {
      const id = typeof tenant === 'string' ? tenant : tenant?.id
      return checkTenantRoles([TENANT_ROLES.ADMIN], user, id)
    })
  
}