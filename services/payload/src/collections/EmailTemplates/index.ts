import { CollectionConfig } from 'payload/types';
import CreateEmailTemplate from '../../components/email-template/CreateEmailTemplate';
import CodeEditorWithCsvValidation from '../../components/email-template/CodeEditorWithCsvValidation';
import EmailPageDescription from '../../components/Email/EmailPageDescription';

import { loggedIn } from './access/loggedIn'
import { tenantAdmins } from './access/tenantAdmins'
import { tenants } from './access/tenants'

import { tenant } from '../../fields/tenant'

const placeholderEmailData = `
  <html>
  <body>

    <h2>Hello {{earnerName}}! Claim your credential at this link</h2>
      <p>Credential: {{credentialName}}</p>
    <a href="{{link}}">{{link}}</a>
    </div>
  </body>

  </html>
`;

const EmailTemplatesCollection: CollectionConfig = {
    slug: 'email-template',
    admin: {
        defaultColumns: ['title', 'id'],
        description: EmailPageDescription,
        useAsTitle: 'title',
        components: {
            views: {
                Edit: CreateEmailTemplate,
            },
        },
    },
    access: {
        read: tenants,
        create: loggedIn,
        update: tenantAdmins,
        delete: tenantAdmins,
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
            name: 'internalNotes',
            type: 'textarea',
            required: false,
            maxLength: 1000,
        },
        {
            name: 'from',
            type: 'text',
            required: false,
            admin: { description: 'Example: Bob <bob@gmail.com>' },
        },
        {
            name: 'emailSubjectTitle',
            type: 'text',
            required: false,
            minLength: 3,
            maxLength: 100,
        },
        {
            name: 'emailTemplatesHandlebarsCode', // required
            type: 'code', // required
            admin: {
                language: 'handlebars',
                description:
                    'Write an email template using Handlebars syntax that will be used as the body when sending emails.',
                components: { Field: CodeEditorWithCsvValidation },
            },
            defaultValue: placeholderEmailData,
            required: true,
        },
        tenant,
    ],
};

export default EmailTemplatesCollection;
