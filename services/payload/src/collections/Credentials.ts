import { CollectionConfig } from 'payload/types';

import ActionsButton from '../components/ActionsButton';

const CredentialsCollection: CollectionConfig = {
    slug: 'credential',
    admin: {
        defaultColumns: ['credentialName', 'id', 'status', 'actionButton'],
        useAsTitle: 'credentialName',
    },
    versions: {
        drafts: true,
    },
    fields: [
        {
            name: 'credentialName',
            type: 'text',
        },
        {
            name: 'earnerName',
            type: 'text',
        },
        {
            name: 'emailAddress',
            type: 'email',
        },
        {
            name: 'extraFields',
            type: 'json',
            required: false,
        },
        {
            name: 'status',
            type: 'text',
            required: true,
            defaultValue: 'DRAFT',
            admin: { hidden: true },
        },
        {
            name: 'batch',
            type: 'relationship',
            required: true,
            relationTo: 'credential-batch',
            hasMany: false,
        },
        {
            name: 'actionButton',
            label: ' ',
            type: 'ui',
            admin: {
                components: {
                    Field: () => null,
                    Cell: ActionsButton,
                },
            },
        },
    ],
};

export default CredentialsCollection;
