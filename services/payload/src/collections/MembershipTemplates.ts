import { CollectionConfig } from 'payload/types';
import CreateTemplate from '../components/membership-template/CreateTemplate';
import MembershipTemplatePageDescription from '../components/membership-template/MembershipTemplatePageDescription';
import CodeEditorWithCsvValidation from '../components/membership-template/CodeEditorWithCsvValidation';

const MembershipTemplatesCollection: CollectionConfig = {
    slug: 'membership-template',
    admin: {
        defaultColumns: ['title', 'id'],
        useAsTitle: 'title',
        description: MembershipTemplatePageDescription,
        components: { views: { Edit: CreateTemplate } },
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
            name: 'credentialTemplateJson',
            type: 'json',
            admin: {
                description:
                    'Write a credential template using Handlebars syntax that will be used to create credentials.',
                components: { Field: CodeEditorWithCsvValidation },
            },
            required: true,
        },
        {
            name: 'associatedCredentials',
            type: 'relationship',
            required: false,
            relationTo: 'credential',
            hasMany: true,
        },
    ],
};

export default MembershipTemplatesCollection;
