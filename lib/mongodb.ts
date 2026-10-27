import { MongoClient, Db } from "mongodb";
import { getMongoUri, getMongoDbName } from "@/lib/env";

const uri = getMongoUri();
const defaultDbName = getMongoDbName();

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so the client promise
  // is preserved across module reloads caused by HMR.
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, use a module-scoped singleton promise.
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

/**
 * Returns the connected MongoClient instance.
 */
export async function getMongoClient(): Promise<MongoClient> {
  return await clientPromise;
}

/**
 * Returns the target database instance using the centralized configured database name.
 */
export async function getDb(name?: string): Promise<Db> {
  const connectedClient = await getMongoClient();
  return connectedClient.db(name || defaultDbName);
}

/**
 * Central connection helper returning both client and db.
 * Compatible with existing Community API routes.
 */
export async function connectToDatabase(name?: string): Promise<{ client: MongoClient; db: Db }> {
  const connectedClient = await getMongoClient();
  const db = connectedClient.db(name || defaultDbName);
  return { client: connectedClient, db };
}

export default clientPromise;
