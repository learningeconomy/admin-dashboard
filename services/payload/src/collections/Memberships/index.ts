import payload from 'payload';
import { CollectionConfig } from 'payload/types';

import ActionsButton from '../../components/ActionsButton';
import CredentialStatusCell from '../../components/credential/CredentialStatusCell';
import { CREDENTIAL_STATUS } from '../../constants/credentials';
import DefaultListView from '../../components/List/DefaultListView';
import CreateCredential from '../../components/credential/CreateCredential';

import { loggedIn } from './access/loggedIn'
import { tenantAdmins } from './access/tenantAdmins'
import { tenants } from './access/tenants'

import { tenant } from '../../fields/tenant'

const MembershipsCollection: CollectionConfig = {
    slug: 'membership',
    admin: {
        defaultColumns: ['batch', 'earnerName', 'id', 'status', 'actionButton'],
        useAsTitle: 'batch',
        disableDuplicate: true,
        hideAPIURL: true,
        components: { views: { List: DefaultListView, Edit: CreateCredential } },
    },
    access: {
        create: () => false,
        read: tenants,
        update: tenantAdmins,
        delete: tenantAdmins,
    },
    fields: [
        { name: 'earnerName', type: 'text' },
        { name: 'emailAddress', type: 'email' },
        {
            name: 'extraFields',
            type: 'json',
            label: 'Credential Fields',
            admin: {
                description:
                    'You can edit and update the values for additional credential fields in the editor. Hit the Save button to save your changes.',
            },
        },
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
            relationTo: 'membership-batch',
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
            label: 'Actions Button',
            type: 'ui',
            admin: { components: { Field: () => null, Cell: ActionsButton } },
        },
        { name: 'targetDid', type: 'text', admin: { hidden: true } },
        tenant,
    ],
};

export default MembershipsCollection;
