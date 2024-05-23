import { payloadCloud } from '@payloadcms/plugin-cloud';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import { slateEditor } from '@payloadcms/richtext-slate';
import { buildConfig } from 'payload/config';
import path from 'path';
import Users from './collections/Users';
import Tenants from './collections/Tenants';
import Media from './collections/Media';
import CredentialsTemplatesCollection from './collections/CredentialTemplates';
import MembershipTemplatesCollection from './collections/MembershipTemplates';
import CredentialsBatchesCollection from './collections/CredentialBatches';
import MembershipBatchesCollection from './collections/MembershipBatches';
import CredentialsCollection from './collections/Credentials';
import MembershipsCollection from './collections/Memberships';
import EmailTemplatesCollection from './collections/EmailTemplates';
import TrustRegistryCollection from './collections/TrustRegistry';
import SigningIdentitiesCollection from './collections/SigningIdentities';

//components
import { Logo } from './components/Logo';
import { Icon } from './components/Icon';
import SideNav from './components/SideNav/SideNav';

//endpoints
import { healthCheck } from './endpoints/healthCheck';
import { getTenantMetadata } from './endpoints/getTenantMetadata';
import { trustRegistry } from './endpoints/trustRegistry';
import { readPayloadVersion } from './endpoints/readPayloadVersion';
import { createBatchCredentials } from './endpoints/createCredentialsForBatch';
import { getBatchCredentials } from './endpoints/getBatchCredentials';
import { getBatchFields } from './endpoints/getBatchFields';
import { sendEmail } from './endpoints/sendEmail';
import { getCredential } from './endpoints/getCredential';
import { sendBatchEmail } from './endpoints/sendBatchEmail';
import { getCollectionCount } from './endpoints/getCollectionCount';
import { getCredentialLinks } from './endpoints/getCredentialLinks';
import { forwardExchangeRequest } from './endpoints/exchange';
import { permissionTo } from './endpoints/permissionTo';
import { revokeCredential } from './endpoints/revokeCredential';
import { getUserCredentials } from './endpoints/getUserCredentials';
import { selfIssueUserCredentials } from './endpoints/selfIssueUserCredentials';

import DashboardRedirect from './components/DashboardRedirect';
import AccountSettings from './components/AccountSettings';

import cloudStoragePlugin from './plugins/cloudStorage';

export default buildConfig({
    email: {
        transportOptions: {
            host: process.env.SMTP_HOST,
            transportMethod: 'SMTP',
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
            port: 587,
            secure: false, // use TLS
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false,
            },
        },
        //logMockCredentials: true,
        fromName: 'LearnCloud',
        fromAddress: 'no-reply@learncloud.ai',
    },
    editor: slateEditor({}),
    db: mongooseAdapter({ url: process.env.MONGODB_URI ?? false, transactionOptions: false }),
    // Server URL must be disabled for multi-tenancy to work and adapt to different subdomains
    //serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
    cors: '*',
    admin: {
        css: require.resolve('./components/global.scss'),
        user: Users.slug,
        meta: {
            titleSuffix: '- LearnCloud',
            favicon: '/assets/lef-icon.png',
            ogImage: '/assets/lef-icon.png',
        },
        components: {
            Nav: SideNav,
            graphics: { Logo, Icon },
            views: { Dashboard: DashboardRedirect, Account: AccountSettings },
        },
        bundler: webpackBundler(),
        webpack: config => ({
            ...config,
            resolve: {
                ...config.resolve,
                alias: {
                    ...config.resolve.alias,
                    [require.resolve('./helpers/jwtHelpers.ts')]:
                        require.resolve('./mocks/emptyObject'),
                    [require.resolve('./jobs/queue.server.ts')]:
                        require.resolve('./mocks/emptyObject'),
                    [require.resolve('./endpoints/getCredential')]:
                        require.resolve('./mocks/emptyObject'),
                    [require.resolve('./endpoints/getCredentialLinks')]:
                        require.resolve('./mocks/emptyObject'),
                    [require.resolve('./endpoints/exchange')]:
                        require.resolve('./mocks/emptyObject'),
                    [require.resolve('./endpoints/getUserCredentials')]:
                        require.resolve('./mocks/emptyObject'),
                    [require.resolve('./endpoints/selfIssueUserCredentials')]:
                        require.resolve('./mocks/emptyObject'),
                    [require.resolve('./endpoints/getCredentialLinks')]:
                        require.resolve('./mocks/emptyObject'),
                    [require.resolve('./helpers/issuerCoordinator/internal/challenges')]:
                        require.resolve('./mocks/emptyObject'),
                    [require.resolve('./helpers/issuerCoordinator/internal/exchange')]:
                        require.resolve('./mocks/emptyObject'),
                    [require.resolve('./helpers/issuerCoordinator/internal/getCredentialLinks')]:
                        require.resolve('./mocks/emptyObject'),
                    [require.resolve('./helpers/issuerCoordinator/internal/revoke')]:
                        require.resolve('./mocks/emptyObject'),
                },
            },
        }),
    },
    collections: [
        Users,
        Tenants,
        Media,
        CredentialsTemplatesCollection,
        MembershipTemplatesCollection,
        CredentialsBatchesCollection,
        MembershipBatchesCollection,
        CredentialsCollection,
        MembershipsCollection,
        EmailTemplatesCollection,
        TrustRegistryCollection,
        SigningIdentitiesCollection,
    ],
    endpoints: [
        { method: 'get', path: '/health-check', handler: healthCheck },
        { method: 'get', path: '/get-tenant-metadata', handler: getTenantMetadata },
        { method: 'get', path: '/registry', handler: trustRegistry },
        { method: 'post', path: '/send-email', handler: sendEmail },
        { method: 'post', path: '/send-batch-email', handler: sendBatchEmail },
        { method: 'get', path: '/payload-version', handler: readPayloadVersion },
        { method: 'post', path: '/get-batch-credentials', handler: getBatchCredentials },
        { method: 'post', path: '/get-batch-fields', handler: getBatchFields },
        { method: 'post', path: '/create-batch-credentials', handler: createBatchCredentials },
        { method: 'get', path: '/get-credential', handler: getCredential },
        { method: 'post', path: '/get-collection-count', handler: getCollectionCount },
        { method: 'get', path: '/get-credential-links', handler: getCredentialLinks },
        { method: 'post', path: '/exchange/:a/:b/:token', handler: forwardExchangeRequest },
        { method: 'get', path: '/permission-to/:operation/:id', handler: permissionTo },
        { method: 'post', path: '/revoke-credential/:id', handler: revokeCredential },
        { method: 'post', path: '/get-user-credentials', handler: getUserCredentials },
        { method: 'post', path: '/data-source/list', handler: getUserCredentials }, // Backward-Compat with /list endpoints
        { method: 'post', path: '/issue-user-credentials', handler: selfIssueUserCredentials },
        {
            method: 'post',
            path: '/data-source/issue',
            handler: selfIssueUserCredentials,
        }, // Backward-Compat with /issue endpoints
    ],
    typescript: {
        outputFile: path.resolve(__dirname, 'payload-types.ts'),
    },
    graphQL: {
        schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
    },
    plugins: [cloudStoragePlugin],
});