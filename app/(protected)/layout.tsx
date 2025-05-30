// AppLayout.tsx
import LayoutContent from "@/components/LayoutComponents/LayoutContent";
import { ThemeProvider } from "@/components/theme-provider/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleProvider } from "@/utils/context/roleContext";
import { protectionMemberUser } from "@/utils/serversideProtection";
import {
  company_member_table,
  company_referral_link_table,
  user_table,
} from "@prisma/client";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "./loading";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await protectionMemberUser();

  if (result.redirect) {
    redirect(result.redirect);
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <SidebarProvider>
        <RoleProvider
          initialProfile={result.profile as user_table}
          initialTeamMemberProfile={
            result.teamMemberProfile as company_member_table & user_table
          }
          initialReferral={result.referral as company_referral_link_table}
        >
          <Suspense fallback={<Loading />}>
            <LayoutContent>{children}</LayoutContent>
          </Suspense>
        </RoleProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}
