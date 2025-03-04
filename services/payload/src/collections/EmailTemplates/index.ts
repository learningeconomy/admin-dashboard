import { CollectionConfig } from 'payload/types';
import CreateEmailTemplate from '../../components/email-template/CreateEmailTemplate';
import CodeEditorWithCsvValidation from '../../components/email-template/CodeEditorWithCsvValidation';
import EmailPageDescription from '../../components/Email/EmailPageDescription';

import { tenants } from './access/tenants'
import { tenantTemplateManagers } from '../../access/tenantTemplateManagers'

import { tenant } from '../../fields/tenant'

const placeholderEmailData = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Credential Claim</title>
<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
    }
    .email-container {
        max-width: 600px;
        background: white;
        margin: 20px auto;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .header {
        background: #1E1C2C;
        color: white;
        padding: 10px 20px;
        text-align: center;
    }
    .content {
        padding: 20px;
        text-align: center;
        line-height: 1.5;
    }
    .button {
        display: inline-block;
        padding: 10px 20px;
        margin: 20px 0;
        background-color: #12B5DA;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
    }
    .footer {
        text-align: center;
        padding: 10px 20px;
        background-color: #f0f0f0;
        color: #888;
        font-size: 14px;
    }
    @media only screen and (max-width: 600px) {
        .email-container {
            width: 100%;
            margin: 0;
        }
        .header, .content, .footer {
            padding-left: 10px;
            padding-right: 10px;
        }
    }
</style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="https://cdn.filestackcontent.com/ePM1pOzdSVKiCa7WN0vj" alt="LearnCloud Logo" width="120">
        </div>
        <div class="content">
            <h1>Welcome, {{earnerName}}!</h1>
            <p>You are just one step away from claiming your official credentials sent by LearnCloud.</p>
            <p>Please click the button below to verify your identity and access your document.</p>
            <a href="{{link}}" class="button">Claim Your Credential</a>
        </div>
        <div class="footer">
            If you have any questions, please contact support@learncloud.ai
        </div>
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
        create: tenantTemplateManagers,
        update: tenantTemplateManagers,
        delete: tenantTemplateManagers,
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
            admin: { description: 'Example: Tracy P. Morgan' },
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
