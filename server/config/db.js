const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing from the environment variables");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 30000,
  serverSelectionTimeoutMS: 30000,
});

let db;
let isConnected = false;

const createDatabaseIndexes = async () => {
  await Promise.all([
    db.collection("studios").createIndex({
      hostEmail: 1,
      createdAt: -1,
    }),

    db.collection("studios").createIndex({
      createdAt: -1,
    }),

    db.collection("bookings").createIndex({
      customerEmail: 1,
      createdAt: -1,
    }),

    db.collection("bookings").createIndex({
      studioId: 1,
      date: 1,
      status: 1,
    }),

    db.collection("bookings").createIndex({
      hostEmail: 1,
      createdAt: -1,
    }),
  ]);
};

const connectDB = async () => {
  if (isConnected && db) {
    return db;
  }

  try {
    await client.connect();

    db = client.db("studiospace");

    await db.command({ ping: 1 });
    await createDatabaseIndexes();

    isConnected = true;

    console.log("MongoDB connected successfully!");
    console.log("Database indexes created successfully!");

    return db;
  } catch (error) {
    isConnected = false;
    db = undefined;

    console.error("MongoDB connection failed:", error.message);

    throw error;
  }
};

const getDB = () => {
  if (!isConnected || !db) {
    throw new Error("Database is not connected yet!");
  }

  return db;
};

module.exports = { connectDB, getDB };
