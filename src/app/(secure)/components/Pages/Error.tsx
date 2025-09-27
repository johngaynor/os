import React from "react";
import { Button } from "@/components/ui";

export function Error({ error }: { error: string }) {
  return (
    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
      <p className="text-destructive font-medium">Error: {error}</p>
      <Button
        onClick={() => window.location.reload()}
        variant="outline"
        size="sm"
        className="mt-2"
      >
        Try Again
      </Button>
    </div>
  );
}
