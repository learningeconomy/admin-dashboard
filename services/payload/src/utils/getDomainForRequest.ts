import type { PayloadRequest } from 'payload/dist/types'

import { Tenant } from '../payload-types';

import getTenantForRequest from './getTenantForRequest';

/**
 * Returns the domain associated with the request object.
 * @parameter req: Payload Request
 **/
const getDomainForRequest  = async (req: PayloadRequest): Promise<Tenant> => {
  const { user } = req;

    const tenant = await getTenantForRequest(req);
    // TODO: Fallback for no tenant domain / multiple domains associated with tenant - based on the request.
    const tenantDomain = process.env.NODE_ENV === 'production' ? `https://${tenant?.domains?.[0]?.domain}` : `http://${tenant?.domains?.[0]?.domain}`;
    return tenantDomain;
}

export default getDomainForRequest;

