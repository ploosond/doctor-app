import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { getDb } from "@/lib/db"
import { env } from "@/lib/env"
import { sendEmail, emailResetPassword, emailVerify } from "@/lib/services/notifications"

let _auth: ReturnType<typeof betterAuth> | undefined

export async function getAuth() {
  if (!_auth) {
    const db = await getDb()
    _auth = betterAuth({
      baseURL: env.BETTER_AUTH_URL,
      secret: env.BETTER_AUTH_SECRET,
      database: mongodbAdapter(db),
      emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
          await sendEmail({ to: user.email, ...emailResetPassword(url) })
        },
      },
      emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
          await sendEmail({ to: user.email, ...emailVerify(url) })
        },
      },
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
