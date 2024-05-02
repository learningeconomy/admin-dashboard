import { CollectionConfig } from 'payload/types'

import { loggedIn } from './access/loggedIn'
import { tenantAdmins } from './access/tenantAdmins'
import { tenants } from './access/tenants'

import { tenant } from '../../fields/tenant'

const Media: CollectionConfig = {
  slug: 'media',
  labels: { plural: 'Media Library' },
  access: {
    delete: tenantAdmins,
    update: tenantAdmins,
    read: tenants,
    create: loggedIn,
  },
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        // By specifying `undefined` or leaving a height undefined,
        // the image will be sized to a certain width,
        // but it will retain its original aspect ratio
        // and calculate a height automatically.
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
    {
      name: 'public',
      type: 'checkbox',
      label: 'Enable Public Visibility',
      defaultValue: false,
      hidden: true
    },
    tenant
  ],
}

export default Media;