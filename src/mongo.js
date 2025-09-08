import { MongoClient } from 'mongodb';

const HARDCODED_URI =
  'mongodb+srv://nikitanency807_db_user:bVgKVAD62vJl9B4d@cluster0.acrac5a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const MONGODB_URI = process.env.MONGODB_URI || HARDCODED_URI;
const DB_NAME = process.env.DB_NAME || 'ytapp';
const COLLECTION_NAME = process.env.COLLECTION_NAME || 'videos';

let client;
let collection;

export async function connectMongo() {
  if (collection) return collection; // reuse if already connected

  try {
    client = new MongoClient(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    const db = client.db(DB_NAME);
    collection = db.collection(COLLECTION_NAME);

    console.log(`✅ Connected to MongoDB: ${DB_NAME}.${COLLECTION_NAME}`);
    return collection;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    throw err;
  }
}

// Only close when shutting down server (optional)
export async function closeMongo() {
  if (client) {
    await client.close();
    console.log('🔒 MongoDB connection closed');
  }
}
