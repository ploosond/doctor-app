import { MongoClient, Db } from "mongodb"
import mongoose from "mongoose"

// ── MongoClient for Better Auth ───────────────────────────────────────────────
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

function getMongoClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error("MONGODB_URI is not set")
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }
  return global._mongoClientPromise!
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClientPromise()
  return client.db()
}

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
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error("MONGODB_URI is not set")
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { bufferCommands: false })
  }
  cached.conn = await cached.promise
  return cached.conn
}
