"use client";

import MobileNavBar from "@/components/ui/MobileNavBar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getDashboard } from "@/services/Dasboard/Member";
import { getUserWithdrawalToday } from "@/services/User/User";
import { useUserLoadingStore } from "@/store/useLoadingStore";
import { useNotificationCountStore } from "@/store/useNotificationCount";
import { usePackageChartData } from "@/store/usePackageChartData";
import { useUserDashboardEarningsStore } from "@/store/useUserDashboardEarnings";
import { useUserEarningsStore } from "@/store/useUserEarningsStore";
import { useUserHaveAlreadyWithdraw } from "@/store/useWithdrawalToday";
import { ROLE } from "@/utils/constant";
import { useRole } from "@/utils/context/roleContext";
import { createClientSide } from "@/utils/supabase/client";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import DevMode from "../ui/dev-mode";
import { Separator } from "../ui/separator";
import { AppSidebar } from "../ui/side-bar";
import { ModeToggle } from "../ui/toggleDarkmode";
import TopNavigation from "../ui/top-navigation";

type LayoutContentProps = {
  children: React.ReactNode;
};

export default function LayoutContent({ children }: LayoutContentProps) {
  const { teamMemberProfile } = useRole();
  const { setTheme } = useTheme();
  const { setTotalEarnings } = useUserDashboardEarningsStore();
  const { setEarnings } = useUserEarningsStore();
  const { setLoading } = useUserLoadingStore();
  const { setChartData } = usePackageChartData();
  const { setNotificationCount } = useNotificationCountStore();
  const { setIsWithdrawalToday, setCanUserDeposit } =
    useUserHaveAlreadyWithdraw();
  const supabase = createClientSide();

  const isAdmin = useMemo(
    () => teamMemberProfile.company_member_role === ROLE.ADMIN,
    [teamMemberProfile.company_member_role]
  );
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  useEffect(() => {
    if (!isAdmin) {
      setTheme("dark");
    }
  }, [isAdmin, setTheme]);

  const handleFetchTransaction = useCallback(async () => {
    try {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const [
        dashboardData,
        { totalEarnings, userEarningsData, actions },
        // notificationCount,
      ] = await Promise.all([
        getDashboard({ teamMemberId: teamMemberProfile.company_member_id }),
        getUserWithdrawalToday(),
        // getNotificationCount(session?.access_token || ""),
      ]);

      const { canWithdrawReferral, canWithdrawPackage, canUserDeposit } =
        actions;
      setTotalEarnings(totalEarnings);
      setEarnings(userEarningsData);
      setChartData(dashboardData);
      setCanUserDeposit(canUserDeposit);
      setIsWithdrawalToday({
        referral: canWithdrawReferral,
        package: canWithdrawPackage,
      });
      //   setNotificationCount(notificationCount.notification_count);
    } catch (e) {
      console.error("Failed to fetch transaction data", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      handleFetchTransaction();
    }
  }, [isAdmin]);

  const sidebar = useMemo(() => {
    if (!isAdmin) return null;
    return <AppSidebar />;
  }, [isAdmin]);

  const mobileNav = useMemo(() => {
    if (isAdmin) return null;
    return <MobileNavBar />;
  }, [isAdmin]);

  const topNav = useMemo(() => {
    if (isAdmin) return null;
    return <TopNavigation />;
  }, [isAdmin]);

  const breadcrumbs = useMemo(() => {
    return pathSegments.map((segment, i) => {
      const href = "/" + pathSegments.slice(0, i + 1).join("/");
      return {
        label: decodeURIComponent(segment)
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        href,
        isCurrentPage: i === pathSegments.length - 1,
      };
    });
  }, [pathSegments]);

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen w-full overflow-hidden relative">
        <div className="flex-1 flex flex-col overflow-x-auto relative">
          {topNav}

          <div className="pb-24 p-4 relative grow">
            <div className="absolute inset-0 -z-10">
              <Image
                src="/assets/bg/omnixBg.webp"
                alt="Omnix Global Background"
                width={1980}
                height={1080}
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                priority
                placeholder="blur"
                blurDataURL="/assets/bg/omnixBg-small.webp"
              />

              <div className="absolute inset-0 bg-black opacity-40" />
            </div>

            <div className="relative z-10">{children}</div>
          </div>

          {mobileNav}
          <DevMode />
        </div>
      </div>
    );
  } else {
    return (
      <SidebarProvider>
        {sidebar}
        <SidebarInset className="overflow-x-auto">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.href}>
                      <BreadcrumbItem
                        className={
                          index !== breadcrumbs.length - 1
                            ? "hidden md:block"
                            : ""
                        }
                      >
                        {crumb.isCurrentPage ? (
                          <BreadcrumbPage>
                            {crumb.label === "Admin"
                              ? "Dashboard"
                              : crumb.label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link href={crumb.href}>
                              {crumb.label === "Admin"
                                ? "Dashboard"
                                : crumb.label}
                            </Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && (
                        <BreadcrumbSeparator className="hidden md:block" />
                      )}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="pb-24 p-4 relative z-50 grow">
            <div className="absolute inset-0 -z-10">
              <Image
                src="/assets/bg/omnixBg.webp"
                alt="Omnix Global Background"
                width={1980}
                height={1080}
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                priority
                placeholder="blur"
                blurDataURL="/assets/bg/omnixBg-small.webp"
              />

              <div className="absolute inset-0 bg-black opacity-40" />
            </div>
            {children}
          </div>
          <ModeToggle />
        </SidebarInset>
      </SidebarProvider>
    );
  }
}
