// Client-safe builder for Cloudinary built-in sample images (the canonical
// "demo" cloud). Used for decorative placeholders until real assets are uploaded.
export function demoImage(publicId: string, w: number, h: number): string {
  return `https://res.cloudinary.com/demo/image/upload/w_${w},h_${h},c_fill,q_auto,f_auto/${publicId}`
}
