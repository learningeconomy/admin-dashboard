import { cloudStorage } from '@payloadcms/plugin-cloud-storage';
import s3Adapter from './adapters/s3';

const USE_CLOUD_STORAGE = process.env.USE_CLOUD_STORAGE === 'true';

const adapter = USE_CLOUD_STORAGE ? s3Adapter : null;

const cloudStoragePlugin = cloudStorage({
	enabled: USE_CLOUD_STORAGE,
	collections: {
		'media': {
			adapter: s3Adapter,
			disableLocalStorage: USE_CLOUD_STORAGE,
			prefix: 'media/images'
		},
	},
});

export default cloudStoragePlugin;