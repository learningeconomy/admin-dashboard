import type { CollectionConfig } from 'payload/types'

import TenantPageDescription from '../../components/Tenant/TenantPageDescription';
import { superAdmins } from '../../access/superAdmins'
import { tenantAdmins } from './access/tenantAdmins'
import { tenantManagers } from './access/tenantManagers'
import enablePublicVisibility from './hooks/enablePublicVisibility';
import upsertSigningIdentity from './hooks/upsertSigningIdentity';
import { superAdminFieldAccess } from '../../access/superAdmins';

const Tenants: CollectionConfig = {
  slug: 'tenants',
  labels: { singular: 'Network', plural: 'Networks' },
  access: {
    create: superAdmins,
    read: tenantAdmins,
    update: tenantManagers,
    delete: superAdmins,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'domains'],
    description: TenantPageDescription,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'domains',
      type: 'array',
      index: true,
      fields: [
        {
          name: 'domain',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'addToGlobalTrustRegistry',
      type: 'checkbox',
      label: 'Add Trust Registry to Global Trust Registry',
      defaultValue: false,
    },
    {
      name: 'lightThemeIcon', 
      type: 'upload', 
      relationTo: 'media', 
      required: false,
      hooks: {
        // Enable Public Visibility on tenant icons/logos so it can be viewed on login page.
        beforeChange: [enablePublicVisibility],
      }
    },
    {
      name: 'darkThemeIcon', 
      type: 'upload', 
      relationTo: 'media', 
      required: false,
      hooks: {
        // Enable Public Visibility on tenant icons/logos so it can be viewed on login page.
        beforeChange: [enablePublicVisibility],
      }
    },
    {
      name: 'lightThemeLogo', 
      type: 'upload', 
      relationTo: 'media', 
      required: false,
      hooks: {
        // Enable Public Visibility on tenant icons/logos so it can be viewed on login page.
        beforeChange: [enablePublicVisibility],
      }
    },
    {
      name: 'darkThemeLogo', 
      type: 'upload', 
      relationTo: 'media', 
      required: false,
      hooks: {
        // Enable Public Visibility on tenant icons/logos so it can be viewed on login page.
        beforeChange: [enablePublicVisibility],
      }
    },
    {
      name: 'favicon', 
      type: 'upload', 
      relationTo: 'media', 
      required: false,
      hooks: {
        // Enable Public Visibility on tenant icons/logos so it can be viewed on login page.
        beforeChange: [enablePublicVisibility],
      }
    },
  ],
  hooks: {
    afterChange: [upsertSigningIdentity]
  }
}

export default Tenants;