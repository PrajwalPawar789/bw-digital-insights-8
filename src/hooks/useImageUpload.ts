
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File, folder: string = "general") => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      console.log("Uploading image to:", fileName);
      
      const { data, error } = await supabase.storage
        .from('website-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error("Upload error:", error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('website-images')
        .getPublicUrl(fileName);

      console.log("Image uploaded successfully:", publicUrl);
      toast.success("Image uploaded successfully");
      return publicUrl;
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload image");
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const uploadPdf = async (file: File, folder: string = "magazine-pdfs") => {
    setUploading(true);
    try {
      // Validate file type
      if (file.type !== 'application/pdf') {
        throw new Error('Only PDF files are allowed');
      }

      // Validate file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        throw new Error('File size must be less than 50MB');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      console.log("Uploading PDF to:", fileName);
      console.log("File size:", file.size, "bytes");
      
      const { data, error } = await supabase.storage
        .from('magazine-pdfs')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error("PDF upload error:", error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('magazine-pdfs')
        .getPublicUrl(fileName);

      console.log("PDF uploaded successfully:", publicUrl);
      toast.success("PDF uploaded successfully");
      return publicUrl;
    } catch (error) {
      console.error("PDF upload failed:", error);
      toast.error(`Failed to upload PDF: ${error.message}`);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (url: string) => {
    try {
      // Extract filename from URL
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const folderParts = url.split('website-images/')[1];
      
      if (!folderParts) throw new Error("Invalid file URL");

      const { error } = await supabase.storage
        .from('website-images')
        .remove([folderParts]);

      if (error) throw error;
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete image");
      console.error(error);
      throw error;
    }
  };

  return { uploadImage, uploadPdf, deleteImage, uploading };
};
