import { CollectionConfig } from 'payload/types';

import { tenants } from './access/tenants'
import { noaccess } from '../../access/noaccess'

import { tenant } from '../../fields/tenant'

const SigningIdentitiesCollection: CollectionConfig = {
    slug: 'signing-identities',
    labels: { plural: 'Signing Identities' },
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'location'],
    },
    access: {
        read: tenants,
        create: noaccess,
        update: noaccess,
        delete: noaccess,
    },
    fields: [
        {
            name: 'name',
            label: 'Signing Identity Name',
            type: 'text',
            required: true,
            minLength: 3,
            maxLength: 100,
        },
        {
            name: 'did',
            label: 'DID',
            type: 'text',
            required: true,
            admin: { description: 'Example: did:example:1234' },
        },
        {
            name: 'encryptionKeyVersion',
            label: 'Encryption Key Version',
            type: 'text',
            required: true,
            hidden: true,
            admin: { description: 'v1' },
        },
        {
            name: 'encryptedSecret',
            label: 'Encrypted Secret',
            type: 'json',
            required: true,
            hidden: true
        },
        tenant,
    ],
};

export default SigningIdentitiesCollection;
