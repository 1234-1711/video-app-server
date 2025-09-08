# yt-mini-server
Node + Express API that:
1) Reads 10 `videoId`s from MongoDB
2) Calls YouTube Data API v3 for metadata
3) Returns enriched JSON to the RN client


## Setup


```bash
cd server
cp .env.example .env # fill values
npm i
npm run dev # or npm start
