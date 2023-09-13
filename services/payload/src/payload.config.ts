import { buildConfig } from 'payload/config';
import path from 'path';
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
import { getCredential, getCredentialJwt } from './endpoints/getCredential';
import { getCredentialLinks } from './endpoints/getCredentialLinks';
import { forwardExchangeRequest } from './endpoints/exchange';

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
        },
        webpack: config => ({
            ...config,
            resolve: {
                ...config.resolve,
                alias: {
                    ...config.resolve.alias,
                    [require.resolve('./endpoints/getCredential')]:
                        require.resolve('./mocks/emptyObject'),
                    [require.resolve('./endpoints/getCredentialLinks')]:
                        require.resolve('./mocks/emptyObject'),
                    [require.resolve('./endpoints/exchange')]:
                        require.resolve('./mocks/emptyObject'),
                },
            },
        }),
    },
    cors: '*',
    collections: [
        Users,
        CredentialsTemplatesCollection,
        CredentialsBatchesCollection,
        CredentialsCollection,
        EmailTemplatesCollection,
    ],
    endpoints: [
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
        {
            method: 'get',
            path: '/get-credential-links',
            handler: getCredentialLinks,
        },
        {
            method: 'post',
            path: '/exchange/:a/:b/:token',
            handler: forwardExchangeRequest,
        },
    ],
    typescript: {
        outputFile: path.resolve(__dirname, 'payload-types.ts'),
    },
    graphQL: {
        schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
    },
});
