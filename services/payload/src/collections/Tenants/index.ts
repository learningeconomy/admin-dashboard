import type { CollectionConfig } from 'payload/types'

import { superAdmins } from '../../access/superAdmins'
import { tenantAdmins } from './access/tenantAdmins'
import enablePublicVisibility from './hooks/enablePublicVisibility';

const Tenants: CollectionConfig = {
  slug: 'tenants',
  access: {
    create: superAdmins,
    read: tenantAdmins,
    update: tenantAdmins,
    delete: superAdmins,
  },
  admin: {
    useAsTitle: 'name',
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
  ],
}

export default Tenants;