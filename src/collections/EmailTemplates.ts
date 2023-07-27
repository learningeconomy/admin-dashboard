import { CollectionConfig } from "payload/types";

const placeholderEmailData = `{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
  ],
  "type": ["VerifiableCredential", "AlumniCredential"],
  "issuer": { "id": {{ schoolId }} },
  "name": {{ name }},
  "description": {{ description }},
  "issuance"Date: {{ now }},
  "credentialSubject": { "id": {{ studentId }} },
  "id": {{ credentialId }}
}`;

const EmailTemplatesCollection: CollectionConfig = {
  slug: "email-templates",
  admin: {
    defaultColumns: ["title", "id", "status"],
    useAsTitle: "title",
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      minLength: 3,
      maxLength: 100,
    },
    {
      name: "internalNotes",
      type: "textarea",
      required: false,
      maxLength: 1000,
    },
    {
      name: "emailTemplatesHandlebarsCode", // required
      type: "code", // required
      admin: {
        language: 'handlebars'
      },
      defaultValue: placeholderEmailData,
      required: true,
    },
  ],
};

export default EmailTemplatesCollection;
