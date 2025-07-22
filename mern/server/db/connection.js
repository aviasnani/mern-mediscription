import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from 'dotenv';

dotenv.config({ path: './config.env' });

const uri = process.env.ATLAS_URI;

if (!uri) {
  console.error('ATLAS_URI not found in environment variables');
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

async function connectToDatabase() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
    db = client.db("employees"); 
    return db;
  } catch(err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

// Initialize connection
await connectToDatabase();

export default db;