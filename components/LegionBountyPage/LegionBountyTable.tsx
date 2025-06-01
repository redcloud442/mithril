"use client";

import { getLegionBounty } from "@/services/Bounty/Member";
import { useIndirectReferralStore } from "@/store/useIndirrectReferralStore";
import { useRole } from "@/utils/context/roleContext";
import { escapeFormData } from "@/utils/function";
import { LegionRequestData } from "@/utils/types";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { RefreshCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ReusableTable from "../ReusableTable/ReusableTable";
import { Button } from "../ui/button";
import { LegionBountyColumn } from "./LegionBountyColumn";

type FilterFormValues = {
  emailFilter: string;
};

const LegionBountyTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [activePage, setActivePage] = useState(1);
  const [isFetchingList, setIsFetchingList] = useState(false);
  const [refreshCooldown, setRefreshCooldown] = useState(0);
  const { teamMemberProfile } = useRole();

  const { indirectReferral, setIndirectReferral } = useIndirectReferralStore();

  const columnAccessor = sorting?.[0]?.id || "user_date_created";
  const isAscendingSort =
    sorting?.[0]?.desc === undefined ? true : !sorting[0].desc;

  const cachedIndirectReferral = useRef<{
    [key: string]: {
      data: LegionRequestData[];
      totalCount: number;
    };
  }>({});

  const fetchAdminRequest = async () => {
    try {
      if (!teamMemberProfile) return;

      setIsFetchingList(true);

      const cacheKey = `${activePage}`;
      if (cachedIndirectReferral.current[cacheKey]) {
        const cachedData = cachedIndirectReferral.current[cacheKey];
        setIndirectReferral({
          data: cachedData.data,
          count: cachedData.totalCount,
        });
        return;
      }

      const sanitizedData = escapeFormData(getValues());

      const { emailFilter } = sanitizedData;

      const { data, totalCount } = await getLegionBounty({
        teamMemberId: teamMemberProfile.company_member_id,
        page: activePage,
        limit: 10,
        columnAccessor: columnAccessor,
        isAscendingSort: isAscendingSort,
        search: emailFilter,
      });

      setIndirectReferral({
        data: data || [],
        count: totalCount || 0,
      });

      cachedIndirectReferral.current[cacheKey] = {
        data: data || [],
        totalCount: totalCount || 0,
      };
    } catch (e) {
    } finally {
      setIsFetchingList(false);
    }
  };

  const columns = LegionBountyColumn();

  const table = useReactTable({
    data: indirectReferral.data || [],
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
  }, [activePage, sorting, teamMemberProfile]);

  const handleRefresh = () => {
    cachedIndirectReferral.current = {};
    setIsFetchingList(true);
    setRefreshCooldown(60);
    setActivePage(1);
    fetchAdminRequest();
  };

  const pageCount = Math.ceil(indirectReferral.count / 10);

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
    }, 1000); // decrease every second

    return () => clearInterval(interval);
  }, [refreshCooldown]);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
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
      </div>

      <ReusableTable
        table={table}
        columns={columns}
        activePage={activePage}
        totalCount={indirectReferral.count}
        isFetchingList={isFetchingList}
        setActivePage={setActivePage}
        pageCount={pageCount}
      />
    </>
  );
};

export default LegionBountyTable;
