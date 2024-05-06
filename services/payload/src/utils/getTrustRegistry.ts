import { PayloadHandler } from 'payload/config';
import payload from 'payload';
import { User } from '../payload-types';
import { CREDENTIAL_STATUS } from '../constants/credentials';
import { TENANT_ROLES } from '../constants/roles/tenantRoles';
import { checkTenantRoles } from '../collections/Users/utilities/checkTenantRoles';
import { isSuperAdmin } from '../utils/isSuperAdmin';

const statusUrl = process.env.STATUS_URL ?? 'http://localhost:4008';

export type TrustRegistry = {
   [did: string]: {
       name: string, 
       url: string,
       location: string
   };
}

/**
 * Get Trust Registry, either ecosyste-wide or for a specific tenant.
 **
 */
export const getTrustRegistry = async (
    tenantId: string | undefined
): Promise<any> => {

    let registryQuery = {};

    if (tenantId) { 
        registryQuery = {
            tenant: {
                equals: tenantId
            }
        }
    } else {
        const trustedTenants = await payload.find({
            collection: 'tenants',
            depth: 0,
            showHiddenFields: true,
            pagination: false,
            limit: 100,
            where: {
                addToGlobalTrustRegistry: {
                    equals: true
                }
            }
        });

        const trustedTenantIds = trustedTenants.docs.map((tenant) => tenant.id); 
        registryQuery = {
            tenant: {
                in: trustedTenantIds
            }
        }
    }

    const entries = await payload.find({
        collection: 'trust-registry',
        depth: 2,
        showHiddenFields: true,
        page: 1,  
        limit: 100,
        pagination: false, 
        where: registryQuery,
        sort: '-name',
    });

    const trustRegistry: TrustRegistry = entries.docs.reduce((prev, current) => {
        if(!current?.did) return prev;

        return {
            ...prev,
            [current?.did]: {
                name: current.name,
                url: current.url,
                location: current.location
            }
        }
    }, {})

    return trustRegistry;
};