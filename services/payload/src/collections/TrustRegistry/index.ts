import { CollectionConfig } from 'payload/types';
import CreateEmailTemplate from '../../components/email-template/CreateEmailTemplate';
import CodeEditorWithCsvValidation from '../../components/email-template/CodeEditorWithCsvValidation';
import EmailPageDescription from '../../components/Email/EmailPageDescription';

import TrustRegistryPageDescription from '../../components/TrustRegistry/TrustRegistryPageDescription';

import { tenants } from './access/tenants'
import { tenantTrustRegistryManager } from '../../access/tenantTrustRegistryManager'

import { tenant } from '../../fields/tenant'

const TrustRegistryCollection: CollectionConfig = {
    slug: 'trust-registry',
    labels: { plural: 'Trust Registry' },
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'location'],
        description: TrustRegistryPageDescription,
    },
    access: {
        read: tenants,
        create: tenantTrustRegistryManager,
        update: tenantTrustRegistryManager,
        delete: tenantTrustRegistryManager,
    },
    fields: [
        {
            name: 'name',
            label: 'Entity Name',
            type: 'text',
            required: true,
            minLength: 3,
            maxLength: 100,
        },
        {
            name: 'did',
            label: 'Entity DID Identifier',
            type: 'text',
            required: true,
            admin: { description: 'Example: did:example:1234' },
        },
        {
            name: 'url',
            label: 'Entity URL',
            type: 'text',
            required: false,
            admin: { description: 'Example: https://www.learncloud.ai' },
        },
        {
            name: 'location',
            label: 'Entity Location',
            type: 'text',
            required: false,
            admin: { description: 'Example: Washington, D.C.' },
            minLength: 3,
            maxLength: 100,
        },
        {
            name: 'internalNotes',
            label: 'Internal Notes',
            type: 'textarea',
            required: false,
            maxLength: 1000,
        },
        tenant,
    ],
};

export default TrustRegistryCollection;
