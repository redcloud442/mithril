import RegisterPage from "@/components/registerPage/registerPage";
import prisma from "@/utils/prisma";
import { redirect } from "next/navigation";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ CODE: string }>;
}) {
  const { CODE } = await searchParams;

  return {
    title: "Omnix Global | Register and Begin Your Journey",
    description:
      "Join Omnix Global now — your path to digital prosperity begins here!",
    openGraph: {
      url: `https://www.omnixglobal.io/access/register?CODE=${CODE}`,
      title: `Join Omnix Global Now!`,
      description:
        "Unlock exclusive rewards and opportunities by joining Omnix Global today.",
      siteName: "www.omnixglobal.io",
      images: [
        {
          url: "https://www.omnixglobal.io/assets/icons/logo.ico",
          width: 1200,
          height: 630,
          alt: "Omnix Global Registration Banner",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Join Omnix Global Now! Invited by ${CODE}`,
      description: "Be part of the Omnix Global revolution — register today.",
      images: ["https://www.omnixglobal.io/assets/icons/logo.ico"], // Same or different from OG
    },
  };
}

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ CODE: string }>;
}) => {
  const { CODE } = await searchParams;

  if (!CODE) {
    redirect("/auth/login");
  }

  const user = await prisma.user_table.findFirst({
    where: {
      company_member_table: {
        some: {
          company_referral_link_table: {
            some: {
              company_referral_code: CODE,
            },
          },
          AND: [
            {
              company_member_is_active: true,
            },
          ],
        },
      },
    },
    select: {
      user_username: true,
    },
  });

  if (!user) {
    redirect("/access/login");
  }

  return (
    <RegisterPage referralLink={CODE} userName={user?.user_username || ""} />
  );
};

export default Page;
