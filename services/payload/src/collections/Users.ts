import { CollectionConfig } from 'payload/types';

const Users: CollectionConfig = {
    slug: 'users',
    auth: true,
    admin: { useAsTitle: 'email' },
    fields: [{ name: 'name', type: 'text' }],
};

export default Users;
