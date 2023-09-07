import { CollectionConfig } from 'payload/types';
import CreateTemplate from '../components/template/CreateTemplate';
import TemplatePageDescription from '../components/template/TemplatePageDescription';

const placeHolderVc = `{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1"
  ],
  "type": ["VerifiableCredential", "AlumniCredential"],
  "issuer": { "id": "{{ schoolId }}" },
  "name": "{{ name }}",
  "description": "{{ description }}",
  "issuanceDate": "{{ now }}",
  "credentialSubject": { "id": "{{ studentId }}" },
  "id": "{{ credentialId }}"
}`;

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
            required: true,
        },
    ],
};

export default CredentialsTemplatesCollection;
