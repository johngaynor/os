"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
      <p className="text-lg text-muted-foreground mb-8">{error.message}</p>
      <button
        onClick={() => reset()}
        className="text-blue-400 hover:underline border border-blue-400 rounded px-4 py-2"
      >
        Try again
      </button>
    </div>
  );
}
