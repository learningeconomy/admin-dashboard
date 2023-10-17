import { PayloadHandler } from 'payload/config';
import { Forbidden } from 'payload/errors';
import payload from 'payload';
import { CREDENTIAL_STATUS } from '../constants/credentials';
import { withSSR } from 'react-i18next';

export const createBatchCredentials: PayloadHandler = async (req, res, next) => {
    if (!req.user) throw new Forbidden();

    try {
        console.log('//req body', req?.body);
        const id = req?.body?.batchId;
        const newFields: string[] = req?.body?.fields ?? [];

        const batch = await payload.findByID({ collection: 'credential-batch', id, draft: true });
        const created = await Promise.all(
            req?.body?.credentialRecords?.map(async record => {
                const newCredentialRecord = await payload.create({
                    collection: 'credential',
                    data: {
                        credentialName: record?.credentialName ?? batch.title,
                        earnerName:
                            record?.earnerName ??
                            record?.fullName ??
                            record?.['Full Name'] ??
                            record?.firstName ??
                            record?.['First Name'] ??
                            'Unknown',
                        emailAddress:
                            record?.eamilAddress ?? record?.['Email Address'] ?? 'Unknown',
                        extraFields: record,
                        status: CREDENTIAL_STATUS.DRAFT,
                        batch: id,
                    },
                    locale: 'en',
                });

                return newCredentialRecord;
            })
        );

        console.log('///CREATE CRED BATCH ENDPOINT', created);

        const existingFields = (batch.csvFields as string[]) ?? [];

        const fields = Array.from(new Set([...newFields, ...existingFields]));

        const newBatch = await payload.update({
            collection: 'credential-batch',
            draft: true,
            id,
            data: { csvFields: fields },
        });

        // Queue up email jobs for the batch

        res.status(200).json({ data: created, newBatch });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
};
