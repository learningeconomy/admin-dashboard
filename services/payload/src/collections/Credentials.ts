import { CollectionConfig } from 'payload/types';

import ActionsButton from '../components/ActionsButton';
import CredentialStatusCell from '../components/credential/CredentialStatusCell';
import { CREDENTIAL_STATUS } from '../constants/credentials';

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
        { name: 'credentialName', type: 'text' },
        { name: 'earnerName', type: 'text' },
        { name: 'emailAddress', type: 'email' },
        { name: 'extraFields', type: 'json' },
        {
            name: 'status',
            type: 'text',
            required: true,
            defaultValue: CREDENTIAL_STATUS.DRAFT,
            admin: {
                hidden: true,
                components: { Cell: CredentialStatusCell },
            },
        },
        {
            name: 'batch',
            label: 'Batch Name',
            type: 'relationship',
            required: true,
            relationTo: 'credential-batch',
            hasMany: false,
        },
        { name: 'revocationReason', type: 'text', admin: { hidden: true } },
        { name: 'revocationDate', type: 'date', admin: { hidden: true } },
        {
            name: 'revokedBy',
            type: 'relationship',
            relationTo: 'users',
            hasMany: false,
            admin: { hidden: true },
        },
        {
            name: 'actionButton',
            label: ' ',
            type: 'ui',
            admin: { components: { Field: () => null, Cell: ActionsButton } },
        },
    ],
};

export default CredentialsCollection;
