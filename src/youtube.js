// src/youtube.js
import "./config.js";   // ensure env is loaded

import fetch from "node-fetch";

const API_KEY = process.env.YOUTUBE_API_KEY;

export function iso8601ToHMS(iso) {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const [, h = "0", m = "0", s = "0"] = iso.match(regex) || [];
  const hh = String(+h).padStart(2, "0");
  const mm = String(+m).padStart(2, "0");
  const ss = String(+s).padStart(2, "0");
  return +h > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
}

export async function fetchYouTubeMetadata(videoIds = []) {
  if (!API_KEY) {
    throw new Error("❌ Missing YOUTUBE_API_KEY. Set it in .env");
  }
  if (!videoIds.length) return [];

  const ids = videoIds.join(",");
  const url = new URL("https://www.googleapis.com/youtube/v3/videos");
  url.searchParams.set("part", "snippet,contentDetails");
  url.searchParams.set("id", ids);
  url.searchParams.set("key", API_KEY);

  const res = await fetch(url.href);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`YouTube API error: ${res.status} ${text}`);
  }

  const data = await res.json();

  const byId = new Map();
  for (const item of data.items || []) {
    const id = item.id;
    const { title, channelTitle, thumbnails } = item.snippet || {};
    const durationISO = item.contentDetails?.duration || "PT0S";
    byId.set(id, {
      id,
      title,
      channelTitle,
      duration: iso8601ToHMS(durationISO),
      thumbnail:
        thumbnails?.high?.url ||
        thumbnails?.medium?.url ||
        thumbnails?.default?.url ||
        null,
    });
  }

  return videoIds.map((id) =>
    byId.get(id) || {
      id,
      title: null,
      channelTitle: null,
      duration: null,
      thumbnail: null,
    }
  );
}
