import { PayloadHandler } from 'payload/config';
import type { PayloadRequest } from 'payload/dist/types'
import payload from 'payload';

import { Tenant } from '../payload-types';

import { getTenantsFilterForUser } from '../utils/getTenantsFilterForUser';
import { isSuperAdmin } from './isSuperAdmin'

const logs = false;

/**
 * Returns the tenant associated with the request object.
 * @parameter req: Payload Request
 * @parameter checkRole: optionally specify a role to only return the tenant if the request's user has specified role on tenant. 
 **/
const getTenantForRequest  = async (req: PayloadRequest, checkRole?: string): Promise<Tenant> => {
  const { user, payload } = req;

  // always allow super admins through
  if (isSuperAdmin(user)) {
    // RETURN SUPER ADMIN METADATA
  }

  if (logs) {
    const msg = `Finding tenant with host: '${req.headers.host}'`
    payload.logger.info({ msg })
  }

  // read `req.headers.host`, lookup the tenant by `domain` to ensure it exists, and check if the user is an admin of that tenant
  const foundTenants = await payload.find({
    collection: 'tenants',
    where: {
      'domains.domain': {
        in: [req.headers.host],
      },
    },
    depth: 1,
    limit: 1,
    req,
  })

  // if this tenant does not exist, deny access
  if (foundTenants.totalDocs === 0) {
    if (logs) {
      const msg = `No tenant found for ${req.headers.host}`
      payload.logger.info({ msg })
    }

    return false
  }

  if (logs) {
    const msg = `Found tenant: '${foundTenants.docs?.[0]?.name}', checking if user is an tenant ${checkRole}`
    payload.logger.info({ msg })
  }

  // If no role specified, return the tenant of this domain. 
  if(!checkRole) {
    return foundTenants.docs?.[0];
  }

  // finally check if the user is an admin of this tenant
  const tenantWithUser = user?.tenants?.find(
    ({ tenant: userTenant }) => userTenant?.id === foundTenants.docs[0].id,
  )

  if (tenantWithUser?.roles?.some(role => role === checkRole)) {
    if (logs) {
      const msg = `User is an ${checkRole} of ${foundTenants.docs[0].name}, allowing access`
      payload.logger.info({ msg })
    }

    return foundTenants.docs?.[0];
  }

  if (logs) {
    const msg = `User is not an ${checkRole} of ${foundTenants.docs[0].name}, denying access`
    payload.logger.info({ msg })
  }

  return null;
}

export default getTenantForRequest;

