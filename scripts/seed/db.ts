import { config } from "dotenv"
import { resolve } from "path"

config({ path: resolve(process.cwd(), ".env.local") })

import mongoose from "mongoose"
import { MongoClient } from "mongodb"

function uri(): string {
  const u = process.env.MONGODB_URI
  if (!u) throw new Error("MONGODB_URI not set in .env.local")
  return u
}

export async function connect(): Promise<void> {
  await mongoose.connect(uri())
}

export async function disconnect(): Promise<void> {
  await mongoose.disconnect()
}

/** Raw MongoClient for the Better Auth adapter (admin seeder). Caller must close it. */
export async function getMongoClient(): Promise<MongoClient> {
  return new MongoClient(uri()).connect()
}
