import { CollectionConfig } from 'payload/types';
import CreateTemplate from '../../components/membership-template/CreateTemplate';
import MembershipTemplatePageDescription from '../../components/membership-template/MembershipTemplatePageDescription';
import CodeEditorWithCsvValidation from '../../components/membership-template/CodeEditorWithCsvValidation';

import { tenants } from './access/tenants'
import { tenantTemplateManagers } from '../../access/tenantTemplateManagers'

import { tenant } from '../../fields/tenant'

const placeHolderTemplateValue = JSON.parse(`
{
  "type": [
    "VerifiableCredential",
    "OpenBadgeCredential",
    "BoostCredential",
    "BoostID"
  ],
  "name": "{{ boostName }}",
  "boostID": {
    "fontColor": "{{ boostID.fontColor }}",
    "accentColor": "{{ boostID.accentColor }}",
    "IDIssuerName": "{{ boostID.IDIssuerName }}",
    "backgroundImage": "{{ boostID.backgroundImage }}",
    "issuerThumbnail": "{{ boostID.issuerThumbnail }}",
    "dimBackgroundImage": "{{ boostID.dimBackgroundImage }}",
    "showIssuerThumbnail": "{{ boostID.showIssuerThumbnail }}"
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
              }
            }
          },
          "image": {
            "@id": "lcn:boostImage",
            "@type": "xsd:string"
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
    },
    {
      "type": "@type",
      "xsd": "https://www.w3.org/2001/XMLSchema#",
      "lcn": "https://docs.learncard.com/definitions#",
      "BoostID": {
        "@id": "lcn:boostID",
        "@context": {
          "boostID": {
            "@id": "lcn:boostIDField",
            "@context": {
              "fontColor": {
                "@id": "lcn:boostIDFontColor",
                "@type": "xsd:string"
              },
              "accentColor": {
                "@id": "lcn:boostIDAccentColor",
                "@type": "xsd:string"
              },
              "backgroundImage": {
                "@id": "lcn:boostIDBackgroundImage",
                "@type": "xsd:string"
              },
              "dimBackgroundImage": {
                "@id": "lcn:boostIDDimBackgroundImage",
                "@type": "xsd:boolean"
              },
              "issuerThumbnail": {
                "@id": "lcn:boostIDIssuerThumbnail",
                "@type": "xsd:string"
              },
              "showIssuerThumbnail": {
                "@id": "lcn:boostIDShowIssuerThumbnail",
                "@type": "xsd:boolean"
              },
              "IDIssuerName": {
                "@id": "lcn:boostIDIssuerName",
                "@type": "xsd:string"
              }
            }
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
      "criteria": {
        "narrative": "{{ achievementNarrative }}"
      },
      "description": "{{ achievementDescription }}",
      "achievementType": "{{ achievementType }}"
    }
  }
}
`);

const MembershipTemplatesCollection: CollectionConfig = {
    slug: 'membership-template',
    admin: {
        defaultColumns: ['title', 'id'],
        useAsTitle: 'title',
        description: MembershipTemplatePageDescription,
        components: { views: { Edit: CreateTemplate } },
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
            name: 'credentialTemplateJson',
            type: 'json',
            admin: {
                description:
                    'Write a credential template using Handlebars syntax that will be used to create credentials.',
                components: { Field: CodeEditorWithCsvValidation },
            },
            defaultValue: placeHolderTemplateValue,
            required: true,
        },
        {
            name: 'associatedCredentials',
            type: 'relationship',
            required: false,
            relationTo: 'credential',
            hasMany: true,
        },
        tenant,
    ],
};

export default MembershipTemplatesCollection;
