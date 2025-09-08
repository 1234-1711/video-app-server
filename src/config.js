// src/config.js
import dotenv from "dotenv";

// Load .env into process.env
dotenv.config();

// Debug log (you can remove later)
console.log("DEBUG: YOUTUBE_API_KEY loaded =", process.env.YOUTUBE_API_KEY ? "✔️ yes" : "❌ missing");
