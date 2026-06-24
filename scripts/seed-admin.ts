/**
 * Seeds an admin user + sample data.
 * Run: pnpm tsx scripts/seed-admin.ts
 */
import { config } from "dotenv"
import { resolve } from "path"

config({ path: resolve(process.cwd(), ".env.local") })

import mongoose from "mongoose"
import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI!
if (!MONGODB_URI) throw new Error("MONGODB_URI not set in .env.local")

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@drlila.com"
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Admin1234!"

async function main() {
  console.log("Connecting to MongoDB…")
  const mongoClient = await new MongoClient(MONGODB_URI).connect()
  await mongoose.connect(MONGODB_URI)

  // ── 1. Create admin user via Better Auth API ────────────────────────────────
  const { betterAuth } = await import("better-auth")
  const { mongodbAdapter } = await import("better-auth/adapters/mongodb")

  const auth = betterAuth({
    database: mongodbAdapter(mongoClient.db()),
    emailAndPassword: { enabled: true },
  })

  try {
    await auth.api.signUpEmail({
      body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, name: "Dr. Lila" },
    })
    console.log(`✓ Admin user created: ${ADMIN_EMAIL}`)
  } catch {
    console.log(`  Admin user already exists or error — skipping.`)
  }

  await mongoose.disconnect()
  await mongoClient.close()
  console.log("\nDone. Login at http://localhost:3000/login")
  console.log(`  Email:    ${ADMIN_EMAIL}`)
  console.log(`  Password: ${ADMIN_PASSWORD}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
