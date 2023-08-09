import { buildConfig } from 'payload/config';
import path from 'path';
// import Examples from './collections/Examples';
import Users from './collections/Users';
import CredentialsTemplatesCollection from './collections/CredentialTemplates';
import CredentialsBatchesCollection from './collections/CredentialBatches';
import CredentialsCollection from './collections/Credentials';
import EmailTemplatesCollection from './collections/EmailTemplates';
import AfterNavLinks from './components/AfterNavLinks';
//components
import { Logo } from './components/Logo';
import { Icon } from './components/Icon';

// custom component for flows
import CreateBatch from './components/flows/CreateBatch';
import CreateTemplate from './components/flows/CreateTemplate';

export default buildConfig({
  serverURL: 'http://localhost:3000',
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Tecnológico de Monterrey',
      favicon: '/assets/tdm-logo.png',
      ogImage: '/assets/tdm-og.png',
    },
    components: {
      graphics: {
        Logo,
        Icon,
      },
      afterNavLinks: [
        AfterNavLinks,
      ],
      routes: [
        {
          path: '/createbatch',
          Component: CreateBatch,
        },
        {
          path: '/createtemplate',
          Component: CreateTemplate,
        }
      ]
    }
  },
  collections: [
    Users,
    CredentialsTemplatesCollection,
    CredentialsBatchesCollection,
    CredentialsCollection,
    EmailTemplatesCollection,
    // Add Collections here
    // Examples,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
})
