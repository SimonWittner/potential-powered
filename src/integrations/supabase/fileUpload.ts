import { supabase } from "./client";

export async function uploadFileToBucket(bucketName: string, file: File): Promise<string | null> {
  try {
    console.log("Uploading file:", file.name); // Debug log
    // Generate a unique file name using a timestamp
    const uniqueFileName = `${Date.now()}_${file.name}`;

    // Upload the file to the specified bucket
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(uniqueFileName, file);

    if (error) {
      console.error("Error uploading file:", error);
      return null;
    }

    console.log("File uploaded successfully:", data);
    return data.path; // Return the file path for further use
  } catch (error) {
    console.error("Unexpected error during file upload:", error);
    return null;
  }
}
