// app/api/data/route.js
import clientPromise from "../../../lib/mongodb";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("a3-database");
    const collection = db.collection("entries");

    const data = await collection.find({}).toArray();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
