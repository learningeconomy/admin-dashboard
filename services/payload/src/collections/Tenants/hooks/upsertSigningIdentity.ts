import { CollectionAfterChangeHook } from 'payload/types';

import { getLearnCard } from '../../../helpers/learncard.helpers';
import { generateEncryptedSigningIdentity } from '../../../helpers/signingIdentity.helpers';

const logs = true;

const upsertSigningIdentity: CollectionAfterChangeHook = async ({
    doc, // full document data
    req, // full express request
    previousDoc, // document data before updating the collection
    operation, // name of the operation ie. 'create', 'update'
}) => {
    try {
        const tenantId = doc?.id;

        const signingIdentities = await req?.payload.find({
            collection: 'signing-identities',
            where: {
                tenant: {
                    equals: tenantId,
                },
            },
            depth: 0,
            limit: 1,
            req,
        });

        // if this tenant does not exist, deny access
        if (signingIdentities.totalDocs === 0) {
            if (logs) {
                const msg = `No signing identity found for tenant. Creating new one...`;
                req?.payload.logger.info({ msg });
            }

            const signingIdentity = await generateEncryptedSigningIdentity();
            if (logs) {
                const msg = `✅ New signing identity created: ${signingIdentity.did}`;
                req?.payload.logger.info({ msg });
            }

            await req?.payload?.create({
                collection: 'signing-identities',
                data: {
                    name: `${doc?.name} Signing Identity`,
                    did: signingIdentity.did,
                    encryptionKeyVersion: signingIdentity.encryptionKeyVersion,
                    encryptedSecret: signingIdentity.encryptedSecret,
                    tenant: tenantId,
                },
                req,
            });
        }
    } catch (e) {
        console.error(`❌ There was an error creating a signing identity for tenant: ${doc?.name}`);
        console.error(e);
    }

    return doc;
};

export default upsertSigningIdentity;
