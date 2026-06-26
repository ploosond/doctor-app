import { v2 as cloudinary } from "cloudinary"
import { env } from "@/lib/env"

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key:    env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
})

export async function deleteImage(url: string): Promise<void> {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i)
  if (!match) return
  await cloudinary.uploader.destroy(match[1])
}

// Folder root scoped per environment so dev/prod uploads stay separate within a
// shared Cloudinary cloud. Set CLOUDINARY_FOLDER per env (e.g. dr-lila-dev / dr-lila-prod).
const FOLDER_ROOT = env.CLOUDINARY_FOLDER ?? "dr-lila"

export async function uploadImage(file: File, subfolder = "services"): Promise<string> {
  const folder = `${FOLDER_ROOT}/${subfolder}`
  const buffer = Buffer.from(await file.arrayBuffer())
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: "image" }, (err, result) => {
        if (err || !result) return reject(err ?? new Error("Upload failed"))
        resolve(result.secure_url)
      })
      .end(buffer)
  })
}
