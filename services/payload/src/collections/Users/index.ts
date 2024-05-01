import { CollectionConfig } from 'payload/types';
import UserPageDescription from '../../components/User/UserPageDescription';
import CreateUser from '../../components/User/CreateUser';

import { anyone } from '../../access/anyone';
import { superAdminFieldAccess } from '../../access/superAdmins';
import { adminsAndSelf } from './access/adminsAndSelf';
import { tenantAdmins } from './access/tenantAdmins';
import { loginAfterCreate } from './hooks/loginAfterCreate';
import { recordLastLoggedInTenant } from './hooks/recordLastLoggedInTenant';
import { isSuperOrTenantAdmin } from './utilities/isSuperOrTenantAdmin';

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
        update: adminsAndSelf,
        delete: adminsAndSelf,
        admin: isSuperOrTenantAdmin,
    },
    hooks: {
        afterChange: [loginAfterCreate],
        afterLogin: [recordLastLoggedInTenant],
    },
    fields: [
        { name: 'name', type: 'text' },
        {
            name: 'roles',
            type: 'select',
            hasMany: true,
            required: true,
            access: {
                create: superAdminFieldAccess,
                update: superAdminFieldAccess,
                read: superAdminFieldAccess,
            },
            options: [
                {
                    label: 'Super Admin',
                    value: 'super-admin',
                },
                {
                    label: 'User',
                    value: 'user',
                },
            ],
        },
        {
            name: 'tenants',
            type: 'array',
            label: 'Tenants',
            access: {
                create: tenantAdmins,
                update: tenantAdmins,
                read: tenantAdmins,
            },
            fields: [
                {
                    name: 'tenant',
                    type: 'relationship',
                    relationTo: 'tenants',
                    required: true,
                },
                {
                    name: 'roles',
                    type: 'select',
                    hasMany: true,
                    required: true,
                    options: [
                        {
                            label: 'Admin',
                            value: 'admin',
                        },
                        {
                            label: 'User',
                            value: 'user',
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