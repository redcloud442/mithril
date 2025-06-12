import LoginPage from "@/components/loginPage/loginPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Omnix Global Access Login",
  description: "Log in to your Omnix Global account",
  openGraph: {
    url: "https://www.omnixglobal.io/access/login",
    title: "Omnix Global",
    description: "Log in to your Omnix Global account and manage your journey.",
    siteName: "www.omnixglobal.io",
    images: [
      {
        url: "https://www.omnixglobal.io/assets/icons/logo.ico",
        width: 1200,
        height: 630,
        alt: "Omnix Global Login Page",
      },
    ],
    type: "website",
  },
};
const Page = async () => {
  return <LoginPage />;
};
export default Page;
