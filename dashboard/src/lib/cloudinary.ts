import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dvjeaplel",
  api_key: process.env.CLOUDINARY_API_KEY || "965318298626492",
  api_secret: process.env.CLOUDINARY_API_SECRET || "JjK7nxRbUadlYJ4IesuGh1QKw9Q",
  secure: true,
});

export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string = "portfolio"
): Promise<{ url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `shofiqul_portfolio/${folder}`,
        resource_type: "auto",
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Failed to upload image to Cloudinary"));
        } else {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      }
    );

    uploadStream.end(buffer);
  });
}

export default cloudinary;
