import { CollectionConfig } from 'payload/types';
import MembershipBatchPageDescription from '../components/membership-batch/MembershipBatchPageDescription';
import CreateMembershipBatch from '../components/membership-batch/CreateMembershipBatch';
import payload from 'payload';
import { CREDENTIAL_BATCH_STATUS } from '../constants/batches';
import CredentialBatchStatusCell from '../components/membership-batch/CredentialBatchStatusCell';
import { duplicateBatch } from '../endpoints/duplicateBatch';

const MembershipBatchesCollection: CollectionConfig = {
    slug: 'membership-batch',
    labels: { plural: 'Membership Issuance Overview' },
    access: {
        delete: async ({ id }) => {
            try {
                if (!id) return false;

                const doc = await payload.findByID({ collection: 'membership-batch', id });

                if (!doc) return false;

                return doc.status === CREDENTIAL_BATCH_STATUS.DRAFT;
            } catch (error) {
                console.error('Error getting delete permission for membership batch!', {
                    error,
                    id,
                });

                return false;
            }
        },
        update: async ({ id }) => {
            try {
                if (!id) return false;

                const doc = await payload.findByID({ collection: 'membership-batch', id });

                if (!doc) return false;

                return doc.status === CREDENTIAL_BATCH_STATUS.DRAFT;
            } catch (error) {
                console.error('Error getting delete permission for membership batch!', {
                    error,
                    id,
                });

                return false;
            }
        },
    },
    admin: {
        defaultColumns: ['title', 'id', 'status'],
        useAsTitle: 'title',
        description: MembershipBatchPageDescription,
        components: { views: { Edit: CreateMembershipBatch } },
    },
    versions: {
        drafts: {
            autosave: true,
        },
    },
    endpoints: [
        { path: '/:id/duplicate', method: 'post', handler: duplicateBatch('membership-batch') },
    ],
    fields: [
        {
            name: 'title',
            label: 'Batch Title',
            type: 'text',
            required: true,
            minLength: 3,
            maxLength: 100,
        },
        {
            name: 'description',
            type: 'textarea',
            required: false,
            maxLength: 1000,
        },
        {
            name: 'internalNotes',
            type: 'textarea',
            required: false,
            maxLength: 1000,
        },
        {
            name: 'status',
            type: 'text',
            required: true,
            defaultValue: CREDENTIAL_BATCH_STATUS.DRAFT,
            admin: { hidden: true, components: { Cell: CredentialBatchStatusCell } },
        },
        {
            name: 'template',
            type: 'relationship',
            required: true,
            relationTo: 'membership-template',
            hasMany: false,
        },
        {
            name: 'emailTemplate',
            type: 'relationship',
            required: true,
            relationTo: 'email-template',
            hasMany: false,
        },
        {
            name: 'from',
            label: 'Email From',
            type: 'text',
            required: false,
            admin: { description: 'Example: Bob <bob@gmail.com>' },
        },
        {
            name: 'csvFields',
            type: 'json',
            admin: { hidden: true },
        },
    ],
};

export default MembershipBatchesCollection;
