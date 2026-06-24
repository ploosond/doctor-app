import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export async function deleteImage(url: string): Promise<void> {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i)
  if (!match) return
  await cloudinary.uploader.destroy(match[1])
}

export async function uploadImage(file: File, folder = "dr-lila/services"): Promise<string> {
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
