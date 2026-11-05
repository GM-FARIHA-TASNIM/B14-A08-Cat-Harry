const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI;

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

const connectDB = async () => {
  try {
    await client.connect();

    db = client.db("studiospace");

    await db.command({ ping: 1 });

    console.log("MongoDB connected successfully!");

    return db;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error("Database is not connected yet!");
  }

  return db;
};

module.exports = { connectDB, getDB };
