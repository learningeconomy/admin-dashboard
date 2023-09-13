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
import { Icon } from './components/Icon';

//endpoints
import { readPayloadVersion } from './endpoints/readPayloadVersion';
import { createBatchCredentials } from './endpoints/createCredentialsForBatch';
import { getBatchCredentials } from './endpoints/getBatchCredentials';
import { sendEmail } from './endpoints/sendEmail';
import { getCredential, getCredentialJwt } from './endpoints/getCredential';
import { sendBatchEmail } from './endpoints/sendBatchEmail';
//paths
const jwtHelperPath = path.resolve(__dirname, 'helpers/jwtHelpers.ts');
const queuePath = path.resolve(__dirname, 'jobs/queue.server.ts');
const getCredentialPath = path.resolve(__dirname, 'endpoints/getCredential.ts');
const mockModulePath = path.resolve(__dirname, 'mocks/mockGetCredential.js');
const mockQueueModulePath = path.resolve(__dirname, 'mocks/mockQueueModule.js');
const mockJwtHelpersPath = path.resolve(__dirname, 'mocks/mockJwtHelpers.js');

export default buildConfig({
    email: {
        transportOptions: {
            host: process.env.SMTP_HOST,
            transportMethod: 'SMTP',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            port: 587,
            secure: false, // use TLS
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false,
            },
        },
        //logMockCredentials: true,
        fromName: 'Patsy Hessel',
        fromAddress: 'patsy.hessel95@ethereal.email',
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
        },
        webpack: config => ({
            ...config,
            resolve: {
                ...config.resolve,
                alias: {
                    ...config.resolve.alias,
                    [jwtHelperPath]: mockJwtHelpersPath,
                    [queuePath]: mockQueueModulePath,
                    [getCredentialPath]: mockModulePath,
                },
            },
        }),
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
            path: '/send-email',
            handler: sendEmail,
        },
        {
            method: 'post',
            path: '/send-batch-email',
            handler: sendBatchEmail,
        },
        {
            method: 'get',
            path: '/payload-version',
            handler: readPayloadVersion,
        },
        {
            method: 'post',
            path: '/get-batch-credentials',
            handler: getBatchCredentials,
        },
        {
            method: 'post',
            path: '/create-batch-credentials',
            handler: createBatchCredentials,
        },
        // TODO: This is a security hole that needs to go away when we're done testing!!!
        {
            method: 'get',
            path: '/get-credential-jwt',
            handler: getCredentialJwt,
        },
        {
            method: 'get',
            path: '/get-credential',
            handler: getCredential,
        },
    ],
    typescript: {
        outputFile: path.resolve(__dirname, 'payload-types.ts'),
    },
    graphQL: {
        schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
    },
});
