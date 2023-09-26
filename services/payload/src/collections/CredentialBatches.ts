import { CollectionConfig } from 'payload/types';
import BatchPageDescription from '../components/batch/BatchPageDescription';
import CreateBatch from '../components/batch/CreateBatch';

const CredentialsBatchesCollection: CollectionConfig = {
    slug: 'credential-batch',
    labels: {
        plural: 'Issuance Overview',
    },
    admin: {
        defaultColumns: ['title', 'id', 'status'],
        useAsTitle: 'title',
        description: BatchPageDescription,
        components: {
            views: {
                Edit: CreateBatch,
            },
        },
    },
    versions: {
        drafts: {
            autosave: true,
        },
    },
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
            defaultValue: 'DRAFT',
            admin: { hidden: true },
        },
        {
            name: 'template',
            type: 'relationship',
            required: true,
            relationTo: 'credential-template',
            hasMany: false,
        },
        {
            name: 'emailTemplate',
            type: 'relationship',
            required: true,
            relationTo: 'email-template',
            hasMany: false,
        },
    ],
};

export default CredentialsBatchesCollection;
