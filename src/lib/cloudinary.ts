import { v2 as cloudinary } from 'cloudinary';

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;

if (!cloudName || !apiKey) {
  throw new Error('Cloudinary credentials are missing. Please check your environment variables.');
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  secure: true
});

export default cloudinary; 