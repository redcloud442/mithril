"use client";

import { logError } from "@/services/Error/ErrorLogs";
import { getTransactionHistory } from "@/services/Transaction/Transaction";
import { useRole } from "@/utils/context/roleContext";
import { createClientSide } from "@/utils/supabase/client";
import { HistoryData } from "@/utils/types";
import { company_transaction_table } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ReusableCard from "../ui/card-reusable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import HistoryCardList from "./HistoryCardList";

type FilterFormValues = {
  statusFilter: string;
};

const HistoryTable = () => {
  const supabaseClient = createClientSide();
  const queryParams = useSearchParams();
  const transaction = queryParams.get("transaction");

  const { teamMemberProfile } = useRole();

  const [requestData, setRequestData] = useState<HistoryData | null>(null);
  const [activePage, setActivePage] = useState(1);
  const [isFetchingList, setIsFetchingList] = useState(false);

  const { setValue, getValues } = useForm<FilterFormValues>({
    defaultValues: {
      statusFilter: "EARNINGS",
    },
  });

  const currentStatusRef = useRef<"EARNINGS" | "WITHDRAWAL" | "DEPOSIT">(
    transaction as "EARNINGS" | "WITHDRAWAL" | "DEPOSIT"
  );

  const cacheTransaction = useRef<{
    [key: string]: {
      data: company_transaction_table[];
      totalCount: number;
    };
  }>({});

  const fetchRequest = async (
    statusType?: "EARNINGS" | "WITHDRAWAL" | "DEPOSIT"
  ) => {
    try {
      if (!teamMemberProfile) return;
      setIsFetchingList(true);

      const currentStatus = statusType ?? getValues("statusFilter");
      const cacheKey = `${activePage}-${currentStatus}`;

      if (cacheTransaction.current[cacheKey]) {
        const cached = cacheTransaction.current[cacheKey];
        setRequestData({
          data: cached.data,
          count: cached.totalCount,
        });
        return;
      }

      const { transactionHistory, totalTransactions } =
        await getTransactionHistory({
          page: activePage,
          status: currentStatus as "EARNINGS" | "WITHDRAWAL" | "DEPOSIT",
          limit: 10,
        });

      setRequestData({
        data: transactionHistory,
        count: totalTransactions,
      });

      cacheTransaction.current[cacheKey] = {
        data: transactionHistory,
        totalCount: totalTransactions,
      };
    } catch (e) {
      if (e instanceof Error) {
        await logError(supabaseClient, {
          errorMessage: e.message,
          stackTrace: e.stack,
          stackPath:
            "components/TransactionHistoryPage/TransactionHistoryTable.tsx",
        });
      }
    } finally {
      setIsFetchingList(false);
    }
  };

  useEffect(() => {
    if (!teamMemberProfile) return;
    fetchRequest(currentStatusRef.current);
  }, [activePage]);

  const handleTabChange = async (type?: string) => {
    const statusType = type as "EARNINGS" | "WITHDRAWAL" | "DEPOSIT";
    currentStatusRef.current = statusType;
    setValue("statusFilter", statusType);
    setActivePage(1); // Reset pagination on tab change
    window.history.pushState({}, "", `/history?transaction=${statusType}`);

    await fetchRequest(statusType);
  };

  const pageCount = Math.ceil((requestData?.count || 0) / 10);

  const defaultTab =
    (transaction as "EARNINGS" | "WITHDRAWAL" | "DEPOSIT") || "EARNINGS";

  return (
    <ReusableCard type="user" title="Transaction History" className="p-0">
      <Tabs defaultValue={defaultTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="EARNINGS">Earnings</TabsTrigger>
          <TabsTrigger value="WITHDRAWAL">Withdrawal</TabsTrigger>
          <TabsTrigger value="DEPOSIT">Deposit</TabsTrigger>
        </TabsList>

        <TabsContent value="EARNINGS">
          <HistoryCardList
            data={requestData?.data || []}
            activePage={activePage}
            setActivePage={setActivePage}
            pageCount={pageCount}
            isLoading={isFetchingList}
            currentStatus="EARNINGS"
          />
        </TabsContent>

        <TabsContent value="WITHDRAWAL">
          <HistoryCardList
            data={requestData?.data || []}
            activePage={activePage}
            setActivePage={setActivePage}
            pageCount={pageCount}
            isLoading={isFetchingList}
            currentStatus="WITHDRAWAL"
          />
        </TabsContent>

        <TabsContent value="DEPOSIT">
          <HistoryCardList
            data={requestData?.data || []}
            activePage={activePage}
            setActivePage={setActivePage}
            pageCount={pageCount}
            isLoading={isFetchingList}
            currentStatus="DEPOSIT"
          />
        </TabsContent>
      </Tabs>
    </ReusableCard>
  );
};

export default HistoryTable;
