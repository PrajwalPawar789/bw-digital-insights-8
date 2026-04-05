
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

const DIRECT_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const DIRECT_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Storage uploads bypass the production PHP proxy because binary request bodies
// are not reliably forwarded there.
const directStorageClient =
  DIRECT_SUPABASE_URL && DIRECT_SUPABASE_ANON_KEY
    ? createClient<Database>(DIRECT_SUPABASE_URL, DIRECT_SUPABASE_ANON_KEY)
    : null;

const getStorageClient = async () => {
  if (!directStorageClient) {
    return supabase;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    const { error } = await directStorageClient.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    if (error) {
      console.warn("Falling back to proxied Supabase client for storage access:", error);
      return supabase;
    }
  } else {
    const { error } = await directStorageClient.auth.signOut();
    if (error) {
      console.warn("Failed to clear direct storage session:", error);
    }
  }

  return directStorageClient;
};

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File, folder: string = "general") => {
    setUploading(true);
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Image size must be less than 10MB');
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      console.log("Uploading image to:", fileName);
      console.log("File size:", file.size, "bytes");
      console.log("File type:", file.type);
      
      const storageClient = await getStorageClient();

      const { error } = await storageClient.storage
        .from('website-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (error) {
        console.error("Upload error:", error);
        throw error;
      }

      const { data: { publicUrl } } = storageClient.storage
        .from('website-images')
        .getPublicUrl(fileName);

      console.log("Image uploaded successfully:", publicUrl);
      toast.success("Image uploaded successfully");
      return publicUrl;
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(`Failed to upload image: ${error.message}`);
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

      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      console.log("Uploading PDF to:", fileName);
      console.log("File size:", file.size, "bytes");
      console.log("File type:", file.type);
      
      const storageClient = await getStorageClient();

      const { error } = await storageClient.storage
        .from('magazine-pdfs')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'application/pdf'
        });

      if (error) {
        console.error("PDF upload error:", error);
        throw error;
      }

      const { data: { publicUrl } } = storageClient.storage
        .from('magazine-pdfs')
        .getPublicUrl(fileName);

      console.log("PDF uploaded successfully:", publicUrl);
      
      // Verify the uploaded file is accessible
      try {
        const verifyResponse = await fetch(publicUrl, { method: 'HEAD' });
        if (!verifyResponse.ok) {
          throw new Error(`Uploaded file verification failed: ${verifyResponse.status}`);
        }
        console.log("PDF verification successful, file is accessible");
      } catch (verifyError) {
        console.warn("PDF verification warning:", verifyError);
      }

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

      const storageClient = await getStorageClient();

      const { error } = await storageClient.storage
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

  const deletePdf = async (url: string) => {
    try {
      // Extract filename from URL
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const folderParts = url.split('magazine-pdfs/')[1];
      
      if (!folderParts) throw new Error("Invalid PDF URL");

      const storageClient = await getStorageClient();

      const { error } = await storageClient.storage
        .from('magazine-pdfs')
        .remove([folderParts]);

      if (error) throw error;
      toast.success("PDF deleted successfully");
    } catch (error) {
      toast.error("Failed to delete PDF");
      console.error(error);
      throw error;
    }
  };

  return { uploadImage, uploadPdf, deleteImage, deletePdf, uploading };
};
