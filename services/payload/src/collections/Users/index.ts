import { CollectionConfig } from 'payload/types';
import UserPageDescription from '../../components/User/UserPageDescription';
import CreateUser from '../../components/User/CreateUser';

import { anyone } from '../../access/anyone';
import { superAdminFieldAccess } from '../../access/superAdmins';
import { adminsAndSelf } from './access/adminsAndSelf';
import { userRoleManagersAndSelf } from './access/userRoleManagersAndSelf';
import { tenantAdmins } from './access/tenantAdmins';
import { tenantManagers } from './access/tenantManagers';
import { tenantUserRoleManager } from './access/tenantUserRoleManager';
import { loginAfterCreate } from './hooks/loginAfterCreate';
import { assignToTenant } from './hooks/assignToTenant';
import { recordLastLoggedInTenant } from './hooks/recordLastLoggedInTenant';
import { isSuperOrTenantAdmin } from './utilities/isSuperOrTenantAdmin';
import { TENANT_ROLES } from '../../constants/roles/tenantRoles';
import { USER_ROLES } from '../../constants/roles/userRoles';

const Users: CollectionConfig = {
    slug: 'users',
    auth: { tokenExpiration: 7 * 24 * 60 * 60 },
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'email'],
        description: UserPageDescription,
        components: { views: { Edit: CreateUser } },
    },
    access: {
        read: adminsAndSelf,
        create: anyone,
        update: userRoleManagersAndSelf,
        delete: userRoleManagersAndSelf,
        admin: isSuperOrTenantAdmin,
    },
    hooks: {
        afterChange: [assignToTenant, loginAfterCreate],
        afterLogin: [recordLastLoggedInTenant],
    },
    fields: [
        { name: 'name', type: 'text' },
        {
            name: 'roles',
            type: 'select',
            hasMany: true,
            //required: true,
            access: {
                create: superAdminFieldAccess,
                update: superAdminFieldAccess,
                read: superAdminFieldAccess,
            },
            options: [
                {
                    label: 'Super Admin',
                    value: USER_ROLES.SUPER_ADMIN,
                },
                {
                    label: 'Tenant Manager',
                    value: USER_ROLES.TENANT_MANAGER,
                },
                {
                    label: 'User',
                    value: USER_ROLES.USER,
                },
            ],
        },
        {
            name: 'tenants',
            type: 'array',
            label: { singular: 'Network', plural: 'Networks' },
            access: {
                create: tenantManagers,
                update: tenantUserRoleManager,
                read: tenantAdmins,
            },
            fields: [
                {
                    name: 'tenant',
                    label: { singular: 'Network', plural: 'Networks' },
                    type: 'relationship',
                    relationTo: 'tenants',
                    required: true,
                    access: {
                        create: superAdminFieldAccess,
                        update: superAdminFieldAccess,
                        read: tenantAdmins,
                    },
                },
                {
                    name: 'roles',
                    type: 'select',
                    hasMany: true,
                    required: true,
                    access: {
                        create: tenantUserRoleManager,
                        update: tenantUserRoleManager,
                        read: tenantAdmins,
                    },
                    options: [
                        {
                            label: 'Admin',
                            value: TENANT_ROLES.ADMIN,
                        },
                        {
                            label: 'User Roles Manager',
                            value: TENANT_ROLES.USER_ROLE_MANAGER,
                        },
                        {
                            label: 'Revocation Manager',
                            value: TENANT_ROLES.REVOCATION_MANAGER,
                        },
                        {
                            label: 'Issuer',
                            value: TENANT_ROLES.ISSUER,
                        },
                        {
                            label: 'Batch Manager',
                            value: TENANT_ROLES.BATCH_MANAGER,
                        },
                        {
                            label: 'Template Manager',
                            value: TENANT_ROLES.TEMPLATE_MANAGER,
                        },
                        {
                            label: 'Trust Registry Manager',
                            value: TENANT_ROLES.TRUST_REGISTRY_MANAGER,
                        },
                        {
                            label: 'User',
                            value: TENANT_ROLES.USER,
                        },
                    ],
                },
            ],
        },
        {
            name: 'lastLoggedInTenant',
            type: 'relationship',
            relationTo: 'tenants',
            index: true,
            access: {
                create: () => false,
                read: tenantAdmins,
                update: superAdminFieldAccess,
            },
            admin: {
                position: 'sidebar',
            },
        },
    ],
};

export default Users;