import UserProfilePageUser from "@/components/UserProfilePage/UserProfilePageUser";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { Suspense } from "react";
import Loading from "../loading";

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
    <Suspense fallback={<Loading />}>
      <UserProfilePageUser userProfile={userProfile} />
    </Suspense>
  );
};

export default Page;
