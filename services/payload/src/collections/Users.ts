import { CollectionConfig } from 'payload/types';
import UserPageDescription from '../components/User/UserPageDescription';

const Users: CollectionConfig = {
    slug: 'users',
    auth: true,
    admin: { useAsTitle: 'name', description: UserPageDescription },
    fields: [{ name: 'name', type: 'text' }],
};

export default Users;
