import UserProfilePageUser from "@/components/UserProfilePage/UserProfilePageUser";
import { Metadata } from "next";
import { Suspense } from "react";
import Loading from "../loading";

export const metadata: Metadata = {
  title: "Profile Page",
  description: "User Profile Page",
  openGraph: {
    url: "/profile",
  },
};

const Page = async () => {
  return (
    <Suspense fallback={<Loading />}>
      <UserProfilePageUser />
    </Suspense>
  );
};

export default Page;
