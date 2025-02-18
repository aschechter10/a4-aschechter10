import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  try {
    const client = await clientPromise;
    const db = client.db("a3-database");
    const collection = db.collection("entries");

    const data = await collection.find({ user: username }).toArray();

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

// POST route: Create a new journal entry
export async function POST(req) {
  const { text, user } = await req.json();

  try {
    const client = await clientPromise;
    const db = client.db("a3-database");
    const collection = db.collection("entries");

    // Insert the new entry into the collection
    const result = await collection.insertOne({
      text,
      user,
      createdAt: new Date(),
    });

    // Return the newly created entry
    return new Response(JSON.stringify(result["insertedId"]), {
      status: 201,
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

// PUT route: Update an existing journal entry
export async function PUT(req) {
  const { id, text } = await req.json();

  try {
    const client = await clientPromise;
    const db = client.db("a3-database");
    const collection = db.collection("entries");

    // Update the entry with the new text
    const result = await collection.updateOne(
      { _id: new ObjectId(id) }, // ObjectId is used to find the entry by its ID
      { $set: { text, updatedAt: new Date() } }
    );

    // Check if the update was successful
    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ message: "Entry not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Entry updated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
