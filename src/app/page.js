// app/page.js
"use client";

import { signIn, useSession } from "next-auth/react";
import JournalPage from "./components/Everything";

export default function HomePage() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <JournalPage />
      </>
    );
  } else {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
          <p className="text-lg text-foreground mb-4">You are not signed in.</p>
          <button
            onClick={() => signIn("github")}
            className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-lg shadow-md transition duration-300"
          >
            Sign In with GitHub
          </button>
        </div>
      </>
    );
  }
}
