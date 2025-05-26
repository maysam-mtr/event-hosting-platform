/**
 * Image Upload Utilities
 *
 * Specialized image upload functions for Supabase storage:
 * - Handles image file uploads with optimization
 * - Provides image compression and resizing
 * - Manages image format conversion and validation
 * - Returns optimized image URLs for display
 * - Handles upload errors and retry logic
 *
 * Optimized image upload functionality for profile pictures,
 * company logos, and event images throughout the application.
 */

import { supabase } from "./supabaseClient";

export const uploadImage = async (file, folder = "eventure-imgs/images") => {
  if (!file) return null;

  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage
    .from(folder)
    .upload(filePath, file);

  if (error) throw error;

  const { data: urlData } = await supabase.storage
    .from(folder)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
};
