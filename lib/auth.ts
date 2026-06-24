import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { getDb } from "@/lib/db"

let _auth: ReturnType<typeof betterAuth> | undefined

export async function getAuth() {
  if (!_auth) {
    const db = await getDb()
    _auth = betterAuth({
      database: mongodbAdapter(db),
      emailAndPassword: { enabled: true },
      user: {
        additionalFields: {
          role: { type: "string", required: false, defaultValue: "doctor" },
        },
      },
      session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
      },
    }) as unknown as ReturnType<typeof betterAuth>
  }
  return _auth
}
