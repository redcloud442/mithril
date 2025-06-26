import DepositPage from "@/components/DepositPage/DepositPage";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "../loading";

const handleFetchDeposit = async () => {
  const deposit = await fetch(`${process.env.API_URL}/api/v1/deposit/user`, {
    method: "GET",
    headers: {
      cookie: (await cookies()).toString(),
    },
  });

  if (!deposit.ok) {
    throw new Error("Failed to fetch deposit");
  }

  const data = await deposit.json();

  return data;
};

const page = async () => {
  const { existingDeposit } = await handleFetchDeposit();

  if (existingDeposit) {
    redirect("/dashboard");
  }

  return (
    <Suspense fallback={<Loading />}>
      <DepositPage />
    </Suspense>
  );
};

export default page;
