import type { Access } from 'payload/types';

import { isSuperAdmin } from '../../../utils/isSuperAdmin';

export const tenants: Access = ({ req: { user }, data }) => {
    // If public access is enabled, allow access.
    if (!user) {
        return {
            public: {
                equals: true,
            },
        };
    }

    // individual documents
    return (
        (data?.tenant?.id && user?.lastLoggedInTenant?.id === data.tenant.id) ||
        (!user?.lastLoggedInTenant?.id && isSuperAdmin(user)) || {
            // list of documents
            tenant: {
                equals: user?.lastLoggedInTenant?.id,
            },
        }
    );
};