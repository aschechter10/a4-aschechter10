import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// DELETE route: Delete an existing journal entry
export async function DELETE(req) {
  const id = req.url.split("/").pop(); // Extract the entry ID from the URL

  try {
    const client = await clientPromise;
    const db = client.db("a3-database");
    const collection = db.collection("entries");

    // Delete the entry by its ID
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    // Check if the deletion was successful
    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ message: "Entry not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Entry deleted successfully" }),
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
