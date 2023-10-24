import { CollectionConfig } from 'payload/types';
import CreateTemplate from '../components/template/CreateTemplate';
import TemplatePageDescription from '../components/template/TemplatePageDescription';
import CodeEditorWithCsvValidation from '../components/template/CodeEditorWithCsvValidation';

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
                description: `
                    Write a credential template using Handlebars syntax that will be used to create 
                    credentials. Do not include the issuer.id and credential ID fields as they will 
                    be overwritten. Additionally, the fields credentialName, earnerName, 
                    emailAddress, now, and issuanceDate are available in all credentials regardless 
                    of CSV contents.`,
                components: { Field: CodeEditorWithCsvValidation },
            },
            required: true,
        },
    ],
};

export default CredentialsTemplatesCollection;
