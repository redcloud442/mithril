"use client";

import { getAllyBounty } from "@/services/Bounty/Member";
import { useDirectReferralStore } from "@/store/useDirectReferralStore";
import { useRole } from "@/utils/context/roleContext";
import { escapeFormData } from "@/utils/function";
import { user_table } from "@prisma/client";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Eye, RefreshCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ReusableTable from "../ReusableTable/ReusableTable";
import { Button } from "../ui/button";
import { AllyBountyColumn } from "./AllyBountyColum";

type FilterFormValues = {
  emailFilter: string;
};

const AllyBountyTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [activePage, setActivePage] = useState(1);
  const [isFetchingList, setIsFetchingList] = useState(false);

  const { teamMemberProfile } = useRole();
  const { directReferral, setDirectReferral } = useDirectReferralStore();

  const columnAccessor = sorting?.[0]?.id || "user_date_created";
  const isAscendingSort =
    sorting?.[0]?.desc === undefined ? true : !sorting[0].desc;
  const [refreshCooldown, setRefreshCooldown] = useState(0);
  const [viewAllReferrals, setViewAllReferrals] = useState(false);

  const cachedIndirectReferral = useRef<{
    [key: string]: {
      data: (user_table & {
        total_bounty_earnings: string;
        package_ally_bounty_log_date_created: Date;
        company_referral_date: Date;
      })[];
      totalCount: number;
    };
  }>({});

  const fetchAdminRequest = async () => {
    try {
      if (!teamMemberProfile) return;

      const cacheKey = `${activePage}-${viewAllReferrals}`;

      if (cachedIndirectReferral.current[cacheKey]) {
        const cachedData = cachedIndirectReferral.current[cacheKey];
        setDirectReferral({
          data: cachedData.data,
          count: cachedData.totalCount,
        });
        return;
      }

      const sanitizedData = escapeFormData(getValues());

      const { emailFilter } = sanitizedData;

      const { data, totalCount } = await getAllyBounty({
        page: activePage,
        limit: 10,
        columnAccessor: columnAccessor,
        isAscendingSort: isAscendingSort,
        search: emailFilter,
        viewAllReferrals: viewAllReferrals,
      });

      setDirectReferral({
        data: data as unknown as (user_table & {
          total_bounty_earnings: string;
          package_ally_bounty_log_date_created: Date;
          company_referral_date: Date;
        })[],
        count: totalCount || 0,
      });

      cachedIndirectReferral.current[cacheKey] = {
        data: data as unknown as (user_table & {
          total_bounty_earnings: string;
          package_ally_bounty_log_date_created: Date;
          company_referral_date: Date;
        })[],
        totalCount: totalCount || 0,
      };
    } catch (e) {
    } finally {
      setIsFetchingList(false);
    }
  };

  const columns = AllyBountyColumn(viewAllReferrals);

  const table = useReactTable({
    data: directReferral.data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const { getValues } = useForm<FilterFormValues>({
    defaultValues: {
      emailFilter: "",
    },
  });

  useEffect(() => {
    fetchAdminRequest();
  }, [teamMemberProfile, activePage, sorting, viewAllReferrals]);

  const pageCount = Math.ceil(directReferral.count / 10);

  const handleRefresh = () => {
    cachedIndirectReferral.current = {};
    setIsFetchingList(true);
    setRefreshCooldown(60);
    fetchAdminRequest();
  };

  useEffect(() => {
    if (refreshCooldown === 0) return;

    const interval = setInterval(() => {
      setRefreshCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [refreshCooldown]);

  const handleViewAllReferrals = (value: boolean) => {
    setViewAllReferrals(value);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={isFetchingList || refreshCooldown > 0}
            className="gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            {refreshCooldown > 0
              ? `Wait ${refreshCooldown}s to refresh`
              : "Refresh"}
          </Button>

          <Button
            onClick={() => handleViewAllReferrals(!viewAllReferrals)}
            variant="outline"
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            View All Referrals
          </Button>
        </div>
      </div>

      <ReusableTable
        table={table}
        columns={columns}
        activePage={activePage}
        totalCount={directReferral.count}
        isFetchingList={isFetchingList}
        setActivePage={setActivePage}
        pageCount={pageCount}
      />
    </>
  );
};

export default AllyBountyTable;
