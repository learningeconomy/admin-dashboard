import { PayloadHandler } from 'payload/config';

import getTenantForRequest from '../utils/getTenantForRequest'

// Returns Tenant Metadata for current request.
export const getTenantMetadata: PayloadHandler = async (req, res) => {
    //if (!req.user) return res.sendStatus(401);
    try {    
        const tenant = await getTenantForRequest(req);
        return res.json({ tenant });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err });
    }
};


