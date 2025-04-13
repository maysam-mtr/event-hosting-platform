// utils/uploadImage.js
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
