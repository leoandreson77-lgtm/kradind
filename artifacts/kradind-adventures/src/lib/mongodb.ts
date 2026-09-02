import { MongoClient, Db } from "mongodb";

const uri =
  process.env.MONGODB_URI ||
  process.env.DATABASE_URL ||
  "mongodb+srv://leoandreson77_db_user:QviGuHX49u5WpE6R@cluster0.20c8rgm.mongodb.net/flight_search?retryWrites=true&w=majority";

const options = {
  serverSelectionTimeoutMS: 5000,
};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function getMongoClientPromise(): Promise<MongoClient> {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    if (!clientPromise) {
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

export async function getDb(dbName?: string): Promise<Db> {
  const client = await getMongoClientPromise();
  return client.db(dbName || "flight_search");
}

export async function checkMongoConnection(): Promise<boolean> {
  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    return true;
  } catch (err) {
    console.error("MongoDB ping failed:", err);
    return false;
  }
}
