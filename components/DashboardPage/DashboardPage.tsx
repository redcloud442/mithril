"use client";

import { toast } from "@/hooks/use-toast";
import { logError } from "@/services/Error/ErrorLogs";
import { getUserWithdrawalToday } from "@/services/User/User";
import { usePackageChartData } from "@/store/usePackageChartData";
import { useUserDashboardEarningsStore } from "@/store/useUserDashboardEarnings";
import { useUserEarningsStore } from "@/store/useUserEarningsStore";
import { useUserHaveAlreadyWithdraw } from "@/store/useWithdrawalToday";
import { useRole } from "@/utils/context/roleContext";
import { createClientSide } from "@/utils/supabase/client";
import { package_table } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";

type Props = {
  packages: package_table[];
};

const DashboardPage = ({ packages }: Props) => {
  const supabaseClient = createClientSide();
  const { referral } = useRole();
  const { earnings, setEarnings } = useUserEarningsStore();
  const { setTotalEarnings } = useUserDashboardEarningsStore();
  const { chartData } = usePackageChartData();
  const { teamMemberProfile, profile } = useRole();
  const {
    isWithdrawalToday,
    canUserDeposit,
    setCanUserDeposit,
    setIsWithdrawalToday,
  } = useUserHaveAlreadyWithdraw();
  const [isActive, setIsActive] = useState(
    teamMemberProfile.company_member_is_active
  );

  const [refresh, setRefresh] = useState(false);

  const handleRefresh = async () => {
    try {
      setRefresh(true);
      const { totalEarnings, userEarningsData, actions } =
        await getUserWithdrawalToday();

      if (!totalEarnings || !userEarningsData) return;

      setTotalEarnings({
        directReferralAmount: totalEarnings.directReferralAmount ?? 0,
        indirectReferralAmount: totalEarnings.indirectReferralAmount ?? 0,
        totalEarnings: totalEarnings.totalEarnings ?? 0,
        withdrawalAmount: totalEarnings.withdrawalAmount ?? 0,
        directReferralCount: totalEarnings.directReferralCount ?? 0,
        indirectReferralCount: totalEarnings.indirectReferralCount ?? 0,
        packageEarnings: totalEarnings.packageEarnings ?? 0,
      });

      setEarnings(userEarningsData);

      setCanUserDeposit(actions.canUserDeposit);
      setIsWithdrawalToday({
        referral: actions.canWithdrawReferral,
        package: actions.canWithdrawPackage,
      });
    } catch (e) {
      if (e instanceof Error) {
        await logError(supabaseClient, {
          errorMessage: e.message,
        });
      }
    } finally {
      setRefresh(false);
    }
  };

  const handleReferralLink = (referralLink: string) => {
    navigator.clipboard.writeText(referralLink);

    toast({
      title: "Referral link copied to clipboard",
      description: "You can now share it with your friends",
      variant: "success",
    });
  };

  return (
    <div className="relative min-h-screen h-full flex items-start justify-center">
      <div className="w-full max-w-6xl flex justify-between min-h-screen h-full">
        {/* Left Column */}
        <div className="flex flex-col justify-around space-y-6">
          <Link href="/deposit" className="translate-x-[140px]">
            <Button size="lg" variant="outline" className="px-6 text-2xl">
              DEPOSIT
            </Button>
          </Link>
          <Link href="/referrals">
            <Button size="lg" variant="outline" className="px-6 text-2xl">
              REFERRALS
            </Button>
          </Link>
          <Link href="/settings" className="translate-x-[140px]">
            <Button size="lg" variant="outline" className="px-6 text-2xl">
              SETTINGS
            </Button>
          </Link>
        </div>

        <div className="absolute inset-0 -z-10">
          <Image
            src="/assets/bg/BACKGROUND.webp"
            alt="Aurora Background"
            width={1980}
            height={1080}
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
            priority
            placeholder="blur"
            blurDataURL="/assets/bg/BACKGROUND-small.webp"
          />

          <div className="absolute inset-0 bg-black opacity-40" />
        </div>

        <Image
          src="/assets/icons/AURORA.webp"
          alt="Aurora Background"
          width={1980}
          height={1080}
          className="absolute top-0 left-0 w-full h-full object-cover sm:object-none z-50 border-2 border-red-500"
          priority
        />

        <div className="flex flex-col justify-around space-y-6">
          <Link href="/withdraw" className="translate-x-[-140px]">
            <Button size="lg" variant="outline" className="px-6 text-2xl">
              WITHDRAW
            </Button>
          </Link>
          <Link href="/packages">
            <Button size="lg" variant="outline" className="px-6 text-2xl">
              BUY PACKAGE
            </Button>
          </Link>
          <Link href="/transactions" className="translate-x-[-140px]">
            <Button size="lg" variant="outline" className="px-6 text-2xl">
              TRANSACTIONS
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
