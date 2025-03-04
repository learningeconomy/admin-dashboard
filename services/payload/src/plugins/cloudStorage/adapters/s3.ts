import { s3Adapter } from '@payloadcms/plugin-cloud-storage/s3'

const adapter = s3Adapter({
  config: {
    region: process.env.S3_REGION,
  },
  bucket: process.env.S3_BUCKET,
});


export default adapter;