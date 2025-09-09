import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

let collection;
async function connectDB() {
  if (!collection) {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    collection = db.collection(process.env.COLLECTION_NAME);
  }
}

// API route
app.get("/api/videos", async (req, res) => {
  try {
    await connectDB();
    const videos = await collection.find({}).toArray();
    res.json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ Export for Vercel
export default app;
