import { CollectionConfig } from 'payload/types';
import CreateTemplate from '../components/template/CreateTemplate';
import TemplatePageDescription from '../components/template/TemplatePageDescription';
import ValidateWithCsv from '../components/template/ValidateWithCsv';

const CredentialsTemplatesCollection: CollectionConfig = {
    slug: 'credential-template',
    admin: {
        defaultColumns: ['title', 'id', 'status'],
        useAsTitle: 'title',
        description: TemplatePageDescription,
        components: {
            views: {
                Edit: CreateTemplate,
            },
        },
    },
    versions: {
        drafts: true,
    },
    fields: [
        {
            name: 'title',
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
            name: 'credentialTemplateJson', // required
            type: 'json', // required
            //  defaultValue: JSON.stringify(placeHolderVc),
            admin: {
                description: `Please write a credential template using Handlebars syntax that will 
be used to create credentials. The issuer.id field WILL be overwritten, as will the credential ID, 
so please do not include them! Additionally, the fields credentialName, earnerName, emailAddress, 
now, and issuanceDate are available in all credentials regardless of CSV contents.`,
            },
            required: true,
        },
        {
            name: 'validateWithCsv',
            type: 'ui',
            admin: {
                components: { Field: ValidateWithCsv },
                condition: ({ credentialTemplateJson }) => Boolean(credentialTemplateJson),
            },
        },
    ],
};

export default CredentialsTemplatesCollection;
