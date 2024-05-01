import { CollectionConfig } from 'payload/types';
import BatchPageDescription from '../../components/batch/BatchPageDescription';
import CreateBatch from '../../components/batch/CreateBatch';
import payload from 'payload';
import { CREDENTIAL_BATCH_STATUS } from '../../constants/batches';
import CredentialBatchStatusCell from '../../components/batch/CredentialBatchStatusCell';
import { duplicateBatch } from '../../endpoints/duplicateBatch';

import { loggedIn } from './access/loggedIn'
import { tenantAdmins } from './access/tenantAdmins'
import { tenants } from './access/tenants'

import { tenant } from '../../fields/tenant'

const CredentialsBatchesCollection: CollectionConfig = {
    slug: 'credential-batch',
    labels: { plural: 'Issuance Overview' },
    access: {
        delete: tenantAdmins,
        update: tenantAdmins,
        read: tenants,
        create: loggedIn,
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
    endpoints: [
        { path: '/:id/duplicate', method: 'post', handler: duplicateBatch('credential-batch') },
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
        tenant,
    ],
};

export default CredentialsBatchesCollection;
