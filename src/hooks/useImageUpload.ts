
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File, folder: string = "general") => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('website-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('website-images')
        .getPublicUrl(fileName);

      toast.success("Image uploaded successfully");
      return publicUrl;
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (url: string) => {
    try {
      const fileName = url.split('/').pop();
      if (!fileName) throw new Error("Invalid file URL");

      const { error } = await supabase.storage
        .from('website-images')
        .remove([fileName]);

      if (error) throw error;
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete image");
      console.error(error);
      throw error;
    }
  };

  return { uploadImage, deleteImage, uploading };
};
