import { PayloadHandler } from 'payload/config';
import payload from 'payload';

import { getTenantsFilterForUser } from '../utils/getTenantsFilterForUser';

// returns count given a collectionName and query object for matching
export const getCollectionCount: PayloadHandler = async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const collectionName = req?.body?.collectionName;
    const payloadQuery = req?.body?.query;

    try {
        // const data = await payload.collections[collectionName].Model.count({ ...payloadQuery });
        const data = await payload.db.collections[collectionName].count({ ...payloadQuery, ...getTenantsFilterForUser(req.user) });
        return res.json({ count: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err });
    }
};



