import PackagePage from "@/components/PackagePage/PackagePage";
import { Skeleton } from "@/components/ui/skeleton";
import { cookies } from "next/headers";
import { Suspense } from "react";

const handleFetchPackages = async () => {
  const packages = await fetch(`${process.env.API_URL}/api/v1/package`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: (await cookies()).toString(),
    },
    next: {
      revalidate: 60,
    },
  });

  if (!packages.ok) {
    throw new Error("Failed to fetch packages");
  }

  const { data } = await packages.json();

  return data;
};

const page = async () => {
  const packages = await handleFetchPackages();

  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full max-w-3xl" />
          <Skeleton className="h-64 w-full max-w-2xl" />
        </div>
      }
    >
      <PackagePage packages={packages} />
    </Suspense>
  );
};

export default page;
