import { PayloadHandler } from 'payload/config';
import payload from 'payload';

import { CREDENTIAL_BATCH_STATUS } from '../constants/batches';


// returns count given a collectionName and query object for matching
export const getCollectionCount: PayloadHandler = async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const collectionName = req?.body?.collectionName;
    const payloadQuery = req?.body?.query;
    console.log('///collectioNName', req?.body);
    try {
        const data = await payload.find({
            collection: collectionName, // required
            depth: 1,
            pagination: false,
            where: payloadQuery, // pass a `where` query here
            sort: '-title',
            locale: 'en',
        });

        console.log('////data length', data?.docs?.length)

        res.status(200).json({
            count: data?.docs?.length
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err });
    }
};
