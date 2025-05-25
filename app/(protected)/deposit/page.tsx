import DepositPage from "@/components/DepositPage/DepositPage";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
  const canUserDeposit = await handleFetchDeposit();

  if (canUserDeposit) {
    redirect("/dashboard");
  }

  return <DepositPage />;
};

export default page;
