import payload from 'payload';
import type { PayloadRequest } from 'payload/dist/types'
import type { Tenant } from '../payload-types';

export const getTenantById = async (tenantId: string, req: PayloadRequest): Promise<Tenant | undefined> => {
      return (
        await payload.find({
            collection: 'tenants',
            where: { id: { equals: tenantId } },
            depth: 0,
            req
        })
    ).docs?.[0];
};
