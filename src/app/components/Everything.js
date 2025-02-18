"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function JournalPage() {
  const [entries, setEntries] = useState([]);
  const [entryRefresh, setEntryRefresh] = useState(false);
  const [newEntry, setNewEntry] = useState("");
  const [editingId, setEditingId] = useState("");
  const [editedText, setEditedText] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const username = session.user.email;
    if (!username) {
      router.push("/");
    } else {
      fetch(`/api/entries?username=${username}`)
        .then((res) => res.json())
        .then((data) => setEntries(data))
        .catch((err) => console.error("Error fetching entries:", err));
    }
  }, [router, entryRefresh]);

  const handleAddEntry = async () => {
    if (!newEntry.trim()) return alert("Entry cannot be empty");
    const username = session.user.email;

    const res = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newEntry, user: username }),
    });

    if (res.status === 201) {
      setNewEntry("");
      setEntryRefresh((prev) => !prev);
    }
  };

  const handleEditEntry = async (id) => {
    const res = await fetch("/api/entries", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, text: editedText }),
    });

    if (res.status === 200) {
      setEditingId(null);
      setEntries((prev) =>
        prev.map((entry) =>
          entry._id === id ? { ...entry, text: editedText } : entry
        )
      );
    }
  };

  const handleDeleteEntry = async (id) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this entry?"
    );

    if (isConfirmed) {
      const res = await fetch(`/api/entries/${id}`, { method: "DELETE" });

      if (res.status === 200) {
        setEntries((prev) => prev.filter((entry) => entry._id !== id));
        alert("Entry deleted successfully.");
      } else {
        alert("Failed to delete entry. Please try again.");
      }
    } else {
      alert("Entry deletion canceled.");
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen p-4">
      <button
        className="fixed top-5 right-5 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => signOut()}
      >
        Log out
      </button>

      <div className="bg-white shadow-md rounded px-8 py-6 w-full max-w-3xl">
        <h2 className="text-2xl text-gray-800 font-bold mb-6 text-center">
          User Journal
        </h2>

        {/* Journal Entries */}
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry._id} className="bg-gray-50 p-4 rounded shadow">
              {editingId === entry._id ? (
                <textarea
                  className="w-full p-2 border rounded text-gray-800 focus:outline-none"
                  rows={4}
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
              ) : (
                <p className="text-gray-800">{entry.text}</p>
              )}

              <div className="flex justify-end mt-2 space-x-2">
                {editingId === entry._id ? (
                  <>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleEditEntry(entry._id)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => {
                        setEditingId(entry._id);
                        setEditedText(entry.text);
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteEntry(entry._id)}
                    >
                      ❌
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Entry Section */}
        <div className="mt-6">
          <textarea
            className="w-full p-2 border rounded focus:outline-none text-gray-800"
            rows={4}
            placeholder="Write your new journal entry here..."
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={handleAddEntry}
          >
            Add Entry
          </button>
        </div>
      </div>
    </div>
  );
}
