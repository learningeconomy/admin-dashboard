import payload from 'payload';
import { CREDENTIAL_BATCH_STATUS } from '../../../constants/batches';

const isDraftState = async (id: string | number | undefined) => {
 	try {
        if (!id) return false;

        const doc = await payload.findByID({ collection: 'credential-batch', id });

        if (!doc) return false;

        return doc.status === CREDENTIAL_BATCH_STATUS.DRAFT;
    } catch (error) {
        console.error('Error getting draft state for credential batch!', {
            error,
            id,
        });

        return false;
    } 
}

export default isDraftState;