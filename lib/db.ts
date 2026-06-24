import { MongoClient } from "mongodb"
import mongoose from "mongoose"

const uri = process.env.MONGODB_URI!
if (!uri) throw new Error("MONGODB_URI is not set")

// ── MongoClient for Better Auth ───────────────────────────────────────────────
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

let _client: MongoClient
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    _client = new MongoClient(uri)
    global._mongoClientPromise = _client.connect()
  }
} else {
  _client = new MongoClient(uri)
  global._mongoClientPromise = _client.connect()
}
// Better Auth needs a Db instance, not MongoClient
export const dbPromise = global._mongoClientPromise!.then((c) => c.db())

// ── Mongoose singleton (HMR-safe) ─────────────────────────────────────────────
declare global {
  var __mongoose:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined
}

const cached = global.__mongoose ?? { conn: null, promise: null }
global.__mongoose = cached

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { bufferCommands: false })
  }
  cached.conn = await cached.promise
  return cached.conn
}
