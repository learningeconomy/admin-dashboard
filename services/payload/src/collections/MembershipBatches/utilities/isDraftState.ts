import payload from 'payload';
import { CREDENTIAL_BATCH_STATUS } from '../../../constants/batches';

const isDraftState = async (id: string | number | undefined) => {
 	try {
        if (!id) return false;

        const doc = await payload.findByID({ collection: 'membership-batch', id });

        if (!doc) return false;

        return doc.status === CREDENTIAL_BATCH_STATUS.DRAFT;
    } catch (error) {
        console.error('Error getting draft state for membership batch!', {
            error,
            id,
        });

        return false;
    } 
}

export default isDraftState;