import payload from 'payload';
import { CREDENTIAL_STATUS } from '../../../constants/credentials';

const isDraftState = async (id: string | number | undefined) => {
 	try {
        if (!id) return false;

        const doc = await payload.findByID({ collection: 'credential', id });

        if (!doc) return false;

        return doc.status === CREDENTIAL_STATUS.DRAFT;
    } catch (error) {
        console.error('Error getting draft state for credential!', {
            error,
            id,
        });

        return false;
    } 
}

export default isDraftState;