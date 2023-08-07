import { buildConfig } from 'payload/config';
import path from 'path';
// import Examples from './collections/Examples';
import Users from './collections/Users';
import CredentialsTemplatesCollection from './collections/CredentialTemplates';
import CredentialsBatchesCollection from './collections/CredentialBatches';
import CredentialsCollection from './collections/Credentials';
import EmailTemplatesCollection from './collections/EmailTemplates';

//components
import { Logo } from './components/Logo';

export default buildConfig({
  serverURL: 'http://localhost:3000',
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- test',
      favicon: '/assets/tdm-logo.png',
      ogImage: '/assets/tdm-og.png',
    },
    components: {
      graphics: {
        Logo,
      }
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
