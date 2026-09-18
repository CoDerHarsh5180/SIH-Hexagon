import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Ensure trimmed credentials from .env
const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
const apiKey = (process.env.CLOUDINARY_API_KEY || '').trim();
const apiSecret = (process.env.CLOUDINARY_API_SECRET || '').trim();

cloudinary.config({
  cloud_name: cloudName ,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

/**
 * Upload a buffer (PDF file) to Cloudinary
 * @param {Buffer} buffer - File buffer
 * @param {string} folder - Destination folder in Cloudinary
 * @param {string} filename - Original or custom filename
 * @returns {Promise<Object>} Upload result containing secure_url, public_id, etc.
 */
export const uploadPdfToCloudinary = (buffer, folder = 'saral_vault', filename = 'document.pdf') => {
  return new Promise((resolve, reject) => {
    // Generate clean public ID
    const cleanName = filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const publicId = `${cleanName}_${Date.now()}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: 'auto',
        format: 'pdf',
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary] Upload Error:', error);
          return reject(error);
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

export default cloudinary;
