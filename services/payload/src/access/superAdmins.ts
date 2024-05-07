import type { Access } from 'payload/config'
import type { FieldAccess } from 'payload/types'

import { checkUserRoles } from '../utils/checkUserRoles'

export const superAdmins: Access = ({ req: { user } }) => checkUserRoles(['super-admin'], user)

export const superAdminFieldAccess: FieldAccess = ({ req: { user } }) =>
  checkUserRoles(['super-admin'], user)
