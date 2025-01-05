"use server";
import { v2 as cloudinary } from "cloudinary";

export async function uploadFileToServer(formData: FormData): Promise<string> {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const file = formData.get("file") as File;
  const fileData = await file.arrayBuffer();
  const base64File = Buffer.from(fileData).toString("base64");

  const uploadResponse = await cloudinary.uploader.upload(
    `data:${file.type};base64,${base64File}`,
    {
      folder: "uploads",
    }
  );
  return uploadResponse.secure_url;
}
