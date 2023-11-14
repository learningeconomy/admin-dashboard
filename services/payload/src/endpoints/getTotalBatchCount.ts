import { PayloadHandler } from 'payload/config';
import payload from 'payload';

import { CREDENTIAL_BATCH_STATUS } from '../constants/batches';

export const getTotalBatchCount: PayloadHandler = async(req, res) => {
    if (!req.user || req?.body?.collectionName) return res.sendStatus(401);

    const collectionName = req?.body;
    console.log('///collectioNName', req?.body);

    try {
        let version = '1.00';

        const data = await payload.find({
            collection: collectionName, // required
            depth: 1,
            pagination: false,
            where: { status: { equals: CREDENTIAL_BATCH_STATUS.SENT} }, // pass a `where` query here
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
