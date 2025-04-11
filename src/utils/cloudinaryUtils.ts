import { uploadImage } from './uploadImage';

interface ImageTransformations {
  width?: number;
  height?: number;
  crop?: string;
  quality?: number;
  format?: string;
}

export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = await generateSignature(publicId, timestamp);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_id: publicId,
          api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
          timestamp,
          signature,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

export const getTransformedImageUrl = (
  publicId: string,
  transformations: ImageTransformations = {}
): string => {
  const {
    width,
    height,
    crop = 'fill',
    quality = 80,
    format = 'auto'
  } = transformations;

  const transformParams = [
    width && `w_${width}`,
    height && `h_${height}`,
    `c_${crop}`,
    `q_${quality}`,
    `f_${format}`
  ].filter(Boolean).join(',');

  return `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/${transformParams}/${publicId}`;
};

export const uploadCompressedImage = async (
  file: File,
  quality: number = 80,
  maxWidth: number = 1920,
  maxHeight: number = 1080
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }
          
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          
          uploadImage(compressedFile)
            .then(resolve)
            .catch(reject);
        },
        file.type,
        quality / 100
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
  });
};

// Helper function to generate signature (this should be done on the server side in production)
const generateSignature = async (publicId: string, timestamp: number): Promise<string> => {
  // Note: In production, this should be done on the server side
  const message = `public_id=${publicId}&timestamp=${timestamp}${import.meta.env.VITE_CLOUDINARY_API_SECRET}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hash = await crypto.subtle.digest('SHA-1', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}; 