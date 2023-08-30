import { PayloadHandler } from 'payload/config';
import { Forbidden } from 'payload/errors';
import payload from "payload";

export const createBatchCredentials: PayloadHandler = async(req, res, next) => {
  if (!req.user) throw new Forbidden

  try {
   console.log('//req body', req?.body);
    const created = await Promise.all(req?.body?.credentialRecords?.map ( async record => {
          const newCredentialRecord =  await payload.create({
                collection: 'credential',
                data: {
                    credentialName: record?.['Titulo'],
                    extraFields: record,
                    batch: "64ee3ec5a0c9315b8536cc1a",
                },
                locale: 'en',

            });

            return newCredentialRecord;
        })
   );

    console.log('///CREATE CRED BATCH ENDPOINT', created);
    

    res.status(200).json({data: created});
  } catch (err) {
    console.error(err)
    res.status(500).json({ version: undefined })
  }
}