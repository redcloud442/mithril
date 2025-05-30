// app/dashboard/page.tsx
import DashboardPage from "@/components/DashboardPage/DashboardPage";
import { cookies } from "next/headers";
import { Suspense } from "react";
import Loading from "../loading";

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
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();

  const packages = await handleFetchPackages(cookieString);

  return (
    <Suspense fallback={<Loading />}>
      <DashboardPage packages={packages} />
    </Suspense>
  );
};

export default Page;
