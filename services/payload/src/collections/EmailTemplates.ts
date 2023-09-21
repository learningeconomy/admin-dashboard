import { CollectionConfig } from 'payload/types';
import EmailPageDescription from '../components/Email/EmailPageDescription';
const placeholderEmailData = `
<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
   <title>Hello {{earnerName}}! Claim your credential at this link</title>
    <p>{{credentialName}}</p>
   <a href="{{link}}">{{link}}</a>
  </div>
</body>

</html>`;

const EmailTemplatesCollection: CollectionConfig = {
    slug: 'email-template',
    admin: {
        defaultColumns: ['title', 'id', 'status'],
        description: EmailPageDescription,
        useAsTitle: 'title',
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
            name: 'internalNotes',
            type: 'textarea',
            required: false,
            maxLength: 1000,
        },
        {
            name: 'emailTemplatesHandlebarsCode', // required
            type: 'code', // required
            admin: {
                language: 'handlebars',
            },
            defaultValue: placeholderEmailData,
            required: true,
        },
    ],
};

export default EmailTemplatesCollection;
