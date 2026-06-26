import { pathToFileURL } from "url"
import type { MongoClient } from "mongodb"
import { connect, disconnect, getMongoClient } from "./db"

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@drlila.com"
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Admin1234!"

export async function seedAdmin(client: MongoClient): Promise<void> {
  const { betterAuth } = await import("better-auth")
  const { mongodbAdapter } = await import("better-auth/adapters/mongodb")

  const auth = betterAuth({
    database: mongodbAdapter(client.db()),
    emailAndPassword: { enabled: true },
  })

  try {
    await auth.api.signUpEmail({
      body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, name: "Dr. Lila" },
    })
    console.log(`✓ admin: created ${ADMIN_EMAIL}  (password: ${ADMIN_PASSWORD})`)
  } catch {
    console.log("  admin: user already exists — skipping")
  }

  // Pre-verify the seeded admin so requireEmailVerification doesn't block login.
  await client
    .db()
    .collection("user")
    .updateOne({ email: ADMIN_EMAIL }, { $set: { emailVerified: true } })
}

// Standalone runner
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  void (async () => {
    const client = await getMongoClient()
    await connect()
    await seedAdmin(client)
    await disconnect()
    await client.close()
  })()
}
