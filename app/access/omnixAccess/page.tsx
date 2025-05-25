import OmnixAccess from "@/components/OmnixAccess/XeloraAccessPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in your account",
  description: "Sign in an account",
  openGraph: {
    url: "/access/omnixAccess",
  },
};

const Page = async () => {
  return <OmnixAccess />;
};
export default Page;
