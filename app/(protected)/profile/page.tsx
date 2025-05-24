import { Skeleton } from "@/components/ui/skeleton";
import UserProfilePageUser from "@/components/UserProfilePage/UserProfilePageUser";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Profile Page",
  description: "User Profile Page",
  openGraph: {
    url: "/profile",
  },
};

const handleFetchUser = async () => {
  const user = await fetch(`${process.env.API_URL}/api/v1/user`, {
    method: "GET",
    headers: {
      cookie: (await cookies()).toString(),
    },
  });

  if (!user.ok) {
    throw new Error("Failed to fetch user");
  }

  const data = await user.json();

  return data;
};

const Page = async () => {
  const { userProfile } = await handleFetchUser();

  return (
    <Suspense
      fallback={
        <>
          <Skeleton className="h-[calc(100vh-10rem)] w-full" />
          <Skeleton className="h-[calc(100vh-10rem)] w-full" />
          <Skeleton className="h-[calc(100vh-10rem)] w-full" />
        </>
      }
    >
      <UserProfilePageUser userProfile={userProfile} />
    </Suspense>
  );
};

export default Page;
