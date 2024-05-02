import type { BeforeChangeHook } from 'payload/dist/collections/config/types'

const enablePublicVisibility: BeforeChangeHook = async ({ value, operation, req }) => {
  if (operation === 'create' || operation === 'update') {
    // Perform additional validation or transformation for 'create' operation
    await req?.payload.update({
      collection: 'media',
      id: value, 
      data: {
        public: true
      },
    })
  } 
  return value;
}

export default enablePublicVisibility;

