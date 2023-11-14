import { PayloadHandler } from 'payload/config';
import payload from 'payload';

import { CREDENTIAL_BATCH_STATUS } from '../constants/batches';

export const getTotalBatchCount: PayloadHandler = async(req, res) => {
    if (!req.user) return res.sendStatus(401);

    try {
        let version = '1.00';

        const data = await payload.find({
            collection: 'credential-batch', // required
            depth: 1,
            where: { status: { equals: CREDENTIAL_BATCH_STATUS.SENT} }, // pass a `where` query here
            sort: '-title',
            locale: 'en',
        });

        console.log('////data length', data?.docs?.length)

        res.status(200).json({
            version: version,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err });
    }
};
