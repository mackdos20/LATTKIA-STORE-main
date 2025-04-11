import React, { useState } from 'react';
import { uploadImage } from '../utils/uploadImage';
import { deleteImage } from '../utils/cloudinaryUtils';

interface ImageUploadProps {
  onUploadSuccess: (imageUrl: string) => void;
  onUploadError?: (error: Error) => void;
  onDeleteSuccess?: () => void;
  onDeleteError?: (error: Error) => void;
  initialImage?: string;
  folder?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  onDeleteSuccess,
  onDeleteError,
  initialImage,
  folder,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage || null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(initialImage || null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview URL
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const imageUrl = await uploadImage(file, (progress) => {
        setUploadProgress(progress);
      });
      
      setCurrentImageUrl(imageUrl);
      onUploadSuccess(imageUrl);
    } catch (error) {
      console.error('Upload error:', error);
      onUploadError?.(error as Error);
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async () => {
    if (!currentImageUrl) return;

    try {
      // Extract public_id from the URL
      const publicId = currentImageUrl.split('/').pop()?.split('.')[0];
      if (!publicId) throw new Error('Invalid image URL');

      await deleteImage(publicId);
      setCurrentImageUrl(null);
      setPreviewUrl(null);
      onDeleteSuccess?.();
    } catch (error) {
      console.error('Delete error:', error);
      onDeleteError?.(error as Error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="image-upload"
      />
      <label
        htmlFor="image-upload"
        className={`cursor-pointer px-4 py-2 rounded transition-colors ${
          isUploading
            ? 'bg-gray-500 text-white cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </label>
      
      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
      
      {uploadProgress > 0 && (
        <span className="text-sm text-gray-600">
          {uploadProgress}%
        </span>
      )}
      
      {previewUrl && (
        <div className="mt-4 relative">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-xs max-h-48 object-contain rounded-lg shadow-md"
          />
          {currentImageUrl && (
            <button
              onClick={handleDelete}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
              title="Delete image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}; 