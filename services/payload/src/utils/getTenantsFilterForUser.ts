import { isSuperAdmin } from './isSuperAdmin';

export const getTenantsFilterForUser: any = user => {
	if (!user?.lastLoggedInTenant?.id && isSuperAdmin(user)) {
		return {};
	}

	return {
		tenant: user?.lastLoggedInTenant?.id 
	}
};
