import { MongoClient } from "mongodb";

const uri = "mongodb+srv://nikitanency807_db_user:bVgKVAD62vJl9B4d@cluster0.acrac5a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB successfully!");
    const db = client.db("ytapp");
    const collections = await db.listCollections().toArray();
    console.log("📂 Collections in ytapp:", collections.map(c => c.name));
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
  } finally {
    await client.close();
  }
}

run();
