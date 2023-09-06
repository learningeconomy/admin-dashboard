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

//endpoints
import { readPayloadVersion } from './endpoints/readPayloadVersion';
import { createBatchCredentials } from './endpoints/createCredentialsForBatch';
import { getBatchCredentials } from './endpoints/getBatchCredentials';
import { sendEmail } from './endpoints/sendEmail';


export default buildConfig({
  email: {
    transportOptions: {
      host: process.env.SMTP_HOST,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      port: 587,
      secure: true, // use TLS
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
    },
    fromName: "donny",
    fromAddress: "donny@learningeconomy.com",
  },
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
  endpoints: [
    {
      method: 'post',
      path: 'send-email',
      handler: sendEmail,
    },
    {
      method: 'get',
      path: '/payload-version',
      handler: readPayloadVersion
    },
    {
      method: 'post',
      path: '/get-batch-credentials',
      handler: getBatchCredentials
    },
    {
      method: 'post',
      path: '/create-batch-credentials',
      handler: createBatchCredentials
    }
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
})
