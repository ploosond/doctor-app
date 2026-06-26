import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

// Validated environment. Importing `env` triggers boot-time validation, so a
// missing/typo'd variable fails fast with a named error instead of crashing
// deep in a request. Seed scripts run outside Next and keep using process.env.
export const env = createEnv({
  server: {
    MONGODB_URI: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().url(),
    CLOUDINARY_CLOUD_NAME: z.string().min(1),
    CLOUDINARY_API_KEY: z.string().min(1),
    CLOUDINARY_API_SECRET: z.string().min(1),
    CLOUDINARY_FOLDER: z.string().optional(),
    // Email is fail-soft — optional so local/dev runs without Resend.
    RESEND_API_KEY: z.string().optional(),
    RESEND_FROM: z.string().optional(),
    CLINIC_NOTIFY_EMAIL: z.string().email().optional(),
    // Nepal, no DST. Keeps slot generation + date math in clinic time.
    TZ: z.string().default("Asia/Kathmandu"),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: {
    MONGODB_URI: process.env.MONGODB_URI,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_FOLDER: process.env.CLOUDINARY_FOLDER,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM: process.env.RESEND_FROM,
    CLINIC_NOTIFY_EMAIL: process.env.CLINIC_NOTIFY_EMAIL,
    TZ: process.env.TZ,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  emptyStringAsUndefined: true,
})
