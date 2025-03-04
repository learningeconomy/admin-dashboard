import { PayloadHandler } from 'payload/config';

import getTenantForRequest from '../utils/getTenantForRequest'
import { getTrustRegistry } from '../utils/getTrustRegistry';

// Returns Trust Registry, either ecosystem-wide, or for a specific tenant.
export const trustRegistry: PayloadHandler = async (req, res) => {

    try {    
        const tenant = await getTenantForRequest(req);
        const tenantId = typeof tenant === 'string' ? tenant : tenant?.id;
        if (tenantId) {
            const trustRegistry = await getTrustRegistry(tenantId)
            return res.json(trustRegistry);
        } else {
            const trustRegistry = await getTrustRegistry()
            return res.json(trustRegistry);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ err });
    }
};


