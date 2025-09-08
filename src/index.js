// src/index.js
import "./config.js"; // must be the very first import ✅

import express from "express";
import cors from "cors";

import { connectMongo } from "./mongo.js";
import { fetchYouTubeMetadata } from "./youtube.js";

const app = express();
const PORT = process.env.PORT || 4000;

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

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
