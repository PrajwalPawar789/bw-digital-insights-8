import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Uploads now go to the Hostinger-hosted PHP endpoint (/upload.php) instead of
// Supabase Storage. This eliminates Supabase egress for image and PDF traffic.
// The DB and admin auth still use Supabase — only the binary storage layer moved.

const UPLOAD_ENDPOINT = "/upload.php";
const DELETE_ENDPOINT = "/upload.php?action=delete";

const getAuthHeader = async (): Promise<string> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("Not authenticated");
  }
  return `Bearer ${session.access_token}`;
};

const parseError = async (res: Response, fallback: string): Promise<string> => {
  try {
    const body = await res.json();
    if (body && typeof body.error === "string") return body.error;
  } catch {
    /* not JSON */
  }
  return `${fallback} (${res.status})`;
};

type UploadConfig = {
  bucket: "website-images" | "magazine-pdfs";
  folder: string;
  maxBytes: number;
  validateType: (file: File) => string | null;
};

const performUpload = async (file: File, config: UploadConfig): Promise<string> => {
  const typeError = config.validateType(file);
  if (typeError) throw new Error(typeError);
  if (file.size > config.maxBytes) {
    const mb = (config.maxBytes / (1024 * 1024)).toFixed(0);
    throw new Error(`File size must be less than ${mb}MB`);
  }

  const authorization = await getAuthHeader();
  const form = new FormData();
  form.append("file", file);
  form.append("bucket", config.bucket);
  form.append("folder", config.folder);

  const res = await fetch(UPLOAD_ENDPOINT, {
    method: "POST",
    headers: { Authorization: authorization },
    body: form,
  });

  if (!res.ok) {
    throw new Error(await parseError(res, "Upload failed"));
  }

  const data = (await res.json()) as { url?: string };
  if (!data?.url || typeof data.url !== "string") {
    throw new Error("Upload response missing URL");
  }
  return data.url;
};

const performDelete = async (url: string): Promise<void> => {
  const authorization = await getAuthHeader();
  const res = await fetch(DELETE_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    throw new Error(await parseError(res, "Delete failed"));
  }
};

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File, folder: string = "general") => {
    setUploading(true);
    try {
      const url = await performUpload(file, {
        bucket: "website-images",
        folder,
        maxBytes: 10 * 1024 * 1024,
        validateType: (f) =>
          f.type.startsWith("image/") ? null : "Only image files are allowed",
      });
      toast.success("Image uploaded successfully");
      return url;
    } catch (error: any) {
      console.error("Image upload failed:", error);
      toast.error(`Failed to upload image: ${error.message}`);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const uploadPdf = async (file: File, folder: string = "magazine-pdfs") => {
    setUploading(true);
    try {
      const url = await performUpload(file, {
        bucket: "magazine-pdfs",
        folder,
        maxBytes: 50 * 1024 * 1024,
        validateType: (f) =>
          f.type === "application/pdf" ? null : "Only PDF files are allowed",
      });
      toast.success("PDF uploaded successfully");
      return url;
    } catch (error: any) {
      console.error("PDF upload failed:", error);
      toast.error(`Failed to upload PDF: ${error.message}`);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (url: string) => {
    try {
      await performDelete(url);
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Image delete failed:", error);
      toast.error("Failed to delete image");
      throw error;
    }
  };

  const deletePdf = async (url: string) => {
    try {
      await performDelete(url);
      toast.success("PDF deleted successfully");
    } catch (error) {
      console.error("PDF delete failed:", error);
      toast.error("Failed to delete PDF");
      throw error;
    }
  };

  return { uploadImage, uploadPdf, deleteImage, deletePdf, uploading };
};
