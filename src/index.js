import "./config.js"; // must be the very first import ✅

import express from "express";
import cors from "cors";

import { connectMongo } from "./mongo.js";
import { fetchYouTubeMetadata } from "./youtube.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "YouTube Metadata API running" });
});

// Main route: fetch all videos with metadata
app.get("/videos", async (req, res) => {
  try {
    const collection = await connectMongo();
    const docs = await collection.find({}).limit(20).toArray();

    const videoIds = docs.map((d) => d.videoId);
    if (!videoIds.length) {
      return res.json([]);
    }

    const enriched = await fetchYouTubeMetadata(videoIds);
    res.json(enriched);
  } catch (err) {
    console.error("Error in /videos:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ For local dev: run app.listen()
// 🚫 On Vercel, we export the app instead of listening
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}

export default app;
