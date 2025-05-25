"use client";

import { logError } from "@/services/Error/ErrorLogs";
import { getTransactionHistory } from "@/services/Transaction/Transaction";
import { useRole } from "@/utils/context/roleContext";
import { createClientSide } from "@/utils/supabase/client";
import { TransactionHistoryData } from "@/utils/types";
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

  const [requestData, setRequestData] = useState<TransactionHistoryData | null>(
    null
  );
  const [activePage, setActivePage] = useState(1);
  const [isFetchingList, setIsFetchingList] = useState(false);

  const { setValue, getValues } = useForm<FilterFormValues>({
    defaultValues: {
      statusFilter: "EARNINGS",
    },
  });

  const currentStatusRef = useRef<"EARNINGS" | "WITHDRAWAL" | "DEPOSIT">(
    "EARNINGS"
  );

  const fetchRequest = async (
    statusType?: "EARNINGS" | "WITHDRAWAL" | "DEPOSIT"
  ) => {
    try {
      if (!teamMemberProfile) return;
      setIsFetchingList(true);

      const { statusFilter } = getValues();

      const currentStatus = statusType ?? statusFilter;

      const { transactionHistory, totalTransactions } =
        await getTransactionHistory({
          page: activePage,
          status: currentStatus as "EARNINGS" | "WITHDRAWAL" | "DEPOSIT",
          limit: 10,
        });

      setRequestData((prev) => {
        const initialData = prev?.data ?? {
          EARNINGS: { data: [], count: 0 },
          WITHDRAWAL: { data: [], count: 0 },
          DEPOSIT: { data: [], count: 0 },
        };

        return {
          data: {
            ...initialData,
            [currentStatus]: {
              data: transactionHistory,
              count: totalTransactions,
            },
          },
        };
      });
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
    window.history.pushState({}, "", `/history?transaction=${statusType}`);
    setValue("statusFilter", statusType);
    currentStatusRef.current = statusType;

    const hasData = requestData?.data?.[statusType]?.data?.length;
    if (hasData) return;

    await fetchRequest(statusType);
  };

  const pageCount = Math.ceil(
    (requestData?.data?.[currentStatusRef.current]?.count || 0) / 10
  );

  const defaultTab = transaction
    ? (transaction as "EARNINGS" | "WITHDRAWAL" | "DEPOSIT")
    : "EARNINGS";

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
            data={requestData?.data?.["EARNINGS"]?.data || []}
            activePage={activePage}
            setActivePage={setActivePage}
            pageCount={pageCount}
            isLoading={isFetchingList}
            currentStatus={currentStatusRef.current}
          />
        </TabsContent>

        <TabsContent value="WITHDRAWAL">
          <HistoryCardList
            data={requestData?.data?.["WITHDRAWAL"]?.data || []}
            activePage={activePage}
            setActivePage={setActivePage}
            pageCount={pageCount}
            isLoading={isFetchingList}
            currentStatus={currentStatusRef.current}
          />
        </TabsContent>

        <TabsContent value="DEPOSIT">
          <HistoryCardList
            data={requestData?.data?.["DEPOSIT"]?.data || []}
            activePage={activePage}
            setActivePage={setActivePage}
            pageCount={pageCount}
            isLoading={isFetchingList}
            currentStatus={currentStatusRef.current}
          />
        </TabsContent>
      </Tabs>
    </ReusableCard>
  );
};

export default HistoryTable;
