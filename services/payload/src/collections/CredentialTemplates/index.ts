import { CollectionConfig } from 'payload/types';
import CreateTemplate from '../../components/template/CreateTemplate';
import TemplatePageDescription from '../../components/template/TemplatePageDescription';
import CodeEditorWithCsvValidation from '../../components/template/CodeEditorWithCsvValidation';

import { tenants } from './access/tenants'
import { tenantTemplateManagers } from '../../access/tenantTemplateManagers'

import { tenant } from '../../fields/tenant'

const placeHolderTemplateValue = JSON.parse(`
{
  "type": [
    "VerifiableCredential",
    "OpenBadgeCredential",
    "BoostCredential"
  ],
  "image": "{{ boostImage }}",
  "issuer": {
    "name": "{{ issuerName }}",
    "image": "{{ issuerImage }}"
  },
  "display": {
    "displayType": "{{ display.displayType }}",
    "backgroundColor": "{{ display.backgroundColor }}",
    "backgroundImage": "{{ display.backgroundImage }}"
  },
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.2.json",
    {
      "type": "@type",
      "xsd": "https://www.w3.org/2001/XMLSchema#",
      "lcn": "https://docs.learncard.com/definitions#",
      "BoostCredential": {
        "@id": "lcn:boostCredential",
        "@context": {
          "boostId": {
            "@id": "lcn:boostId",
            "@type": "xsd:string"
          },
          "display": {
            "@id": "lcn:boostDisplay",
            "@context": {
              "backgroundImage": {
                "@id": "lcn:boostBackgroundImage",
                "@type": "xsd:string"
              },
              "backgroundColor": {
                "@id": "lcn:boostBackgroundColor",
                "@type": "xsd:string"
              },
              "displayType": {
                "@id": "lcn:boostDisplayType",
                "@type": "xsd:string"
              }
            }
          },
          "attachments": {
            "@id": "lcn:boostAttachments",
            "@container": "@set",
            "@context": {
              "type": {
                "@id": "lcn:boostAttachmentType",
                "@type": "xsd:string"
              },
              "title": {
                "@id": "lcn:boostAttachmentTitle",
                "@type": "xsd:string"
              },
              "url": {
                "@id": "lcn:boostAttachmentUrl",
                "@type": "xsd:string"
              }
            }
          },
          "address": {
            "@id": "https://purl.imsglobal.org/spec/vc/ob/vocab.html#Address"
          }
        }
      }
    }
  ],
  "credentialSubject": {
    "type": [
      "AchievementSubject"
    ],
    "achievement": {
      "type": [
        "Achievement"
      ],
      "name": "{{ achievementName }}",
      "image": "{{ achievementImage }}",
      "criteria": {
        "narrative": "{{ achievementNarrative }}"
      },
      "description": "{{ achievementDescription }}",
      "achievementType": "{{ achievemetType }}"
    }
  }
}
`);

const CredentialsTemplatesCollection: CollectionConfig = {
    slug: 'credential-template',
    admin: {
        defaultColumns: ['title', 'id'],
        useAsTitle: 'title',
        description: TemplatePageDescription,
        components: {
            views: {
                Edit: CreateTemplate,
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
                description:
                    'Write a credential template using Handlebars syntax that will be used to create credentials.',
                components: { Field: CodeEditorWithCsvValidation },
            },
            defaultValue: placeHolderTemplateValue,
            required: true,
        },
        tenant,
    ],
};

export default CredentialsTemplatesCollection;
