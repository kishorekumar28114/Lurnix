import { MongoClient, ObjectId } from "mongodb";
import dns from "node:dns";

if (dns.setServers) {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch (_) {}
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "lurnix";

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  cachedClient = client;
  cachedDb = db;
  return { client, db };
}
