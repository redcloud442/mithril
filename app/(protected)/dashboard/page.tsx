// app/dashboard/page.tsx
import DashboardPage from "@/components/DashboardPage/DashboardPage";
import { Skeleton } from "@/components/ui/skeleton";
import { cookies } from "next/headers";
import { Suspense } from "react";

const handleFetchPackages = async (cookieString: string) => {
  const packages = await fetch(`${process.env.API_URL}/api/v1/package`, {
    method: "GET",
    headers: {
      cookie: cookieString,
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

const Page = async () => {
  const cookieStore = cookies();
  const cookieString = cookieStore.toString();

  const packages = await handleFetchPackages(cookieString);

  return (
    <Suspense fallback={<Skeleton className="min-h-screen h-full w-full" />}>
      <DashboardPage packages={packages} />
    </Suspense>
  );
};

export default Page;
