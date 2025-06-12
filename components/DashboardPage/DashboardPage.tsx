"use client";

import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { logError } from "@/services/Error/ErrorLogs";
import { getUserWithdrawalToday } from "@/services/User/User";
import { usePackageChartData } from "@/store/usePackageChartData";
import { useUserDashboardEarningsStore } from "@/store/useUserDashboardEarnings";
import { useUserEarningsStore } from "@/store/useUserEarningsStore";
import { useUserHaveAlreadyWithdraw } from "@/store/useWithdrawalToday";
import { useRole } from "@/utils/context/roleContext";
import { formatDateToYYYYMMDD } from "@/utils/function";
import { createClientSide } from "@/utils/supabase/client";
import { package_table } from "@prisma/client";
import { Download, Smartphone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CardBalance from "../ui/card-balance";
import ReusableCard from "../ui/card-reusable";
import {
  default as DashboardCardBg,
  default as ReusableCardBg,
} from "./DashboardCardBg/DashboardCardBg";
import DashboardDepositProfile from "./DashboardDepositRequest/DashboardDepositModal/DashboardDepositProfile";
import DashboardTotalEarnings from "./DashboardDepositRequest/DashboardTotalEarnings/DashboardTotalEarnings";
import DashboardPackages from "./DashboardPackages";

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

  const [refresh, setRefresh] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleDownload = () => {
    setIsDownloading(true);
    setDownloadProgress(0);

    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          // Trigger actual download
          const link = document.createElement("a");
          link.href = "https://apkfilelinkcreator.cloud/uploads/Omnix.apk";
          link.download = "Omnix_v1.0.apk";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          return 0;
        }
        return prev + Math.random() * 20;
      });
    }, 100);
  };

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
    <div className="relative min-h-screen h-full mx-auto py-4">
      <div className="w-full space-y-4 md:px-10">
        <ReusableCard type="user" className="p-0 space-y-4">
          <DashboardCardBg type="gradient" className="p-2">
            <div className="flex flex-col justify-center items-center gap-4">
              <DashboardDepositProfile />
              <span className="text-2xl text-black text-balance">
                {" "}
                {profile?.user_first_name} {profile?.user_last_name}
              </span>
            </div>
          </DashboardCardBg>

          <div className="flex flex-col justify-center items-center sm:items-stretch gap-4">
            <div className="flex justify-center items-stretch gap-4 flex-grow">
              <DashboardCardBg className="min-h-[100px] flex-1 p-2 text-center text-black rounded-sm flex flex-col justify-center w-full">
                <h2 className="text-lg font-bold whitespace-nowrap">
                  {profile?.user_username}
                </h2>
                <p className="text-sm font-bold whitespace-nowrap">Username</p>
              </DashboardCardBg>

              <DashboardCardBg className="min-h-[100px] flex-1 p-2 text-center text-black rounded-sm flex flex-col justify-center">
                <div className="text-lg font-bold whitespace-nowrap">
                  {formatDateToYYYYMMDD(profile?.user_date_created || "")}
                  <p className="text-sm font-bold whitespace-nowrap">
                    Member Since
                  </p>
                </div>
              </DashboardCardBg>
            </div>
            {teamMemberProfile?.company_member_is_active && (
              <div className="space-y-1">
                <div
                  onClick={() =>
                    handleReferralLink(
                      "https://www.omnix-global.com/access/register?CODE=" +
                        referral?.company_referral_code
                    )
                  }
                  className="text-xl text-center font-bold border-2 p-1 bg-orange-950 border-orange-500 cursor-pointer"
                >
                  CLICK HERE TO COPY REFERRAL LINK
                </div>
                <div className="text-[11px] font-bold border-2 p-1 bg-orange-950 border-orange-500 text-center">
                  https://www.omnix-global.com/access/register?CODE=
                  {referral?.company_referral_code}
                </div>
              </div>
            )}

            <div className="relative group">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className={`
              relative w-full overflow-hidden rounded-sm p-6 px-10 transition-all duration-300 transform
              ${
                isDownloading
                  ? "bg-yellow-300 scale-102"
                  : "bg-yellow-300 hover:bg-yellow-500 hover:scale-102 hover:shadow-2xl hover:shadow-yellow-500/25"
              }
              disabled:cursor-not-allowed active:scale-95
            `}
              >
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                {/* Button Content */}
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {isDownloading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <div className="text-left">
                        <div className="text-white font-semibold">
                          Downloading...
                        </div>
                        <div className="text-blue-100 text-sm">
                          {Math.round(downloadProgress)}% complete
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-6 h-6 text-amber-500" />
                        <Download className="w-5 h-5 text-amber-500 group-hover:animate-bounce" />
                      </div>
                      <div className="text-left">
                        <div className=" font-bold text-sm sm:text-lg text-amber-500">
                          Download Omnix-global App
                        </div>
                        <div className="text-amber-500 text-sm">
                          v1.0 • Free
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Progress Bar */}
                {isDownloading && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div
                      className="h-full bg-white transition-all duration-300 ease-out"
                      style={{ width: `${downloadProgress}%` }}
                    ></div>
                  </div>
                )}
              </button>
            </div>
          </div>
        </ReusableCard>

        <CardBalance
          packages={packages}
          handleClick={handleRefresh}
          refresh={refresh}
          value={earnings?.company_combined_earnings ?? 0}
        />

        <DashboardTotalEarnings refresh={refresh} />

        <ReusableCard type="user" className="p-0 space-y-4">
          <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ReusableCardBg type="gray" className="p-1">
              <Link
                href={canUserDeposit ? "/deposit" : "#"}
                className={cn(
                  "flex flex-col items-center transition-opacity",
                  !canUserDeposit && "pointer-events-none opacity-50 grayscale"
                )}
              >
                <Image
                  src="/assets/icons/deposit.ico"
                  alt="Deposit"
                  width={60}
                  height={60}
                />
                <p className="text-sm sm:text-lg font-bold mt-2">DEPOSIT</p>
              </Link>
            </ReusableCardBg>

            <ReusableCardBg type="gray" className="p-1">
              <Link
                href={
                  isWithdrawalToday.package || isWithdrawalToday.referral
                    ? "/withdraw"
                    : "#"
                }
                className={cn(
                  "flex flex-col items-center transition-opacity",
                  !isWithdrawalToday.package &&
                    !isWithdrawalToday.referral &&
                    "pointer-events-none opacity-50 grayscale"
                )}
              >
                <Image
                  src="/assets/icons/withdraw.ico"
                  alt="Withdraw"
                  width={60}
                  height={60}
                />
                <p className="text-[12px] sm:text-lg font-bold mt-2">
                  WITHDRAW
                </p>
              </Link>
            </ReusableCardBg>

            <ReusableCardBg type="gray" className="p-1">
              <Link
                href="/trading"
                className="flex flex-col items-center cursor-pointer"
              >
                <Image
                  src="/assets/icons/trading.ico"
                  alt="Trading"
                  width={60}
                  height={60}
                />
                <p className="text-[12px] sm:text-lg text-center font-bold mt-2">
                  TRADING OPTIONS
                </p>
              </Link>
            </ReusableCardBg>

            <ReusableCardBg type="gray" className="p-1">
              <Link
                href="/referral"
                className="flex flex-col items-center cursor-pointer"
              >
                <Image
                  src="/assets/icons/referral.ico"
                  alt="Referral"
                  width={60}
                  height={60}
                />
                <p className="text-[12px] sm:text-lg font-bold mt-2">
                  REFERRAL
                </p>
              </Link>
            </ReusableCardBg>

            <ReusableCardBg type="gray" className="p-1">
              <Link
                href="/matrix"
                className="flex flex-col items-center cursor-pointer"
              >
                <Image
                  src="/assets/icons/matrix.ico"
                  alt="Matrix"
                  width={60}
                  height={60}
                />
                <p className="text-[12px] sm:text-lg font-bold mt-2">MATRIX</p>
              </Link>
            </ReusableCardBg>

            <ReusableCardBg type="gray" className="p-1">
              <Link
                href="https://www.facebook.com/groups/1903585910415931"
                target="_blank"
                className="flex flex-col items-center cursor-pointer"
              >
                <Image
                  src="/assets/icons/fb.ico"
                  alt="Deposit"
                  width={60}
                  height={60}
                />
                <p className="text-[12px] sm:text-lg font-bold mt-2">
                  FB GROUP
                </p>
              </Link>
            </ReusableCardBg>
          </div>
        </ReusableCard>

        {chartData.length > 0 && (
          <div className=" gap-6">
            <DashboardPackages teamMemberProfile={teamMemberProfile} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
