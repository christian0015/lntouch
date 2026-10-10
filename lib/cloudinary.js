// lib/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // lntouch
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

/**
 * Upload une image de coiffure vers Cloudinary.
 * Dossier : lntouch/hairstyles/{slug}/img-{timestamp}
 *
 * @param {string} image  - Base64, URL ou buffer
 * @param {string} slug   - Slug de la coiffure (ex: "knotless-braids-medium")
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export async function uploadHairstyleImage(image, slug) {
  const timestamp = Date.now();

  const result = await cloudinary.uploader.upload(image, {
    folder: `lntouch/hairstyles/${slug}`,
    public_id: `img-${timestamp}`,
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ quality: "auto:good", fetch_format: "auto" }],
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

/**
 * Upload plusieurs images pour une coiffure.
 *
 * @param {string[]} images  - Tableau de base64/URL
 * @param {string}   slug
 * @returns {Promise<Array<{ url: string, publicId: string }>>}
 */
export async function uploadMultipleHairstyleImages(images, slug) {
  return Promise.all(images.map((img) => uploadHairstyleImage(img, slug)));
}

/**
 * Supprime une image par son publicId.
 */
export async function deleteImage(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (err) {
    console.error("Cloudinary delete error:", err);
    return false;
  }
}
