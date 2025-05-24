"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 space-y-4 text-center">
      <h2 className="text-2xl font-semibold text-orange-500">
        Something went wrong!
      </h2>

      <Button variant="outline" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
