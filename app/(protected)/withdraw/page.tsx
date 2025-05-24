// app/withdraw/page.tsx
import { Skeleton } from "@/components/ui/skeleton";
import WithdrawPage from "@/components/WithdrawPage/WithdrawPage";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const handleFetchWithdrawal = async () => {
  const withdrawal = await fetch(
    `${process.env.API_URL}/api/v1/withdraw/user`,
    {
      method: "GET",
      headers: {
        cookie: (await cookies()).toString(),
      },
    }
  );

  if (!withdrawal.ok) {
    throw new Error("Failed to fetch withdrawal");
  }

  const data = await withdrawal.json();

  return data;
};

const Page = async () => {
  const { packageWithdrawal, referralWithdrawal } =
    await handleFetchWithdrawal();

  if (packageWithdrawal || referralWithdrawal) {
    redirect("/dashboard");
  }

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
      <WithdrawPage />
    </Suspense>
  );
};

export default Page;
