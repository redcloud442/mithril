import { formateMonthDateYearv2, formatNumberLocale } from "@/utils/function";
import { company_transaction_table } from "@prisma/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";

type Props = {
  data: company_transaction_table[];
  activePage: number;
  setActivePage: Dispatch<SetStateAction<number>>;
  pageCount: number;
  isLoading?: boolean;
  currentStatus: string;
};

const HistoryCardList = ({
  data,
  activePage,
  setActivePage,
  pageCount,
  isLoading = false,
  currentStatus,
}: Props) => {
  if (data.length === 0) {
    return <p className="text-center text-gray-500">No transactions found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border-2 border-orange-500 shadow-md bg-orange-500/10">
      {isLoading && (
        <div
          className={`block absolute inset-0 top-0 left-0 bg-pageColor/50 dark:bg-zinc-800/70 z-50 transition-opacity duration-300`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse transition-all duration-1000">
              {/* Spinning loader circle */}
              <div className="w-16 h-16 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      )}

      <table className="min-w-full text-sm table-fixed">
        <thead className="bg-[#1a1a1a] text-white uppercase text-xs">
          <tr>
            <th className="px-4 py-3 font-bold w-1/4 text-left">Amount</th>
            <th className="px-4 py-3 font-bold w-1/4 text-left">Date</th>
            <th className="px-4 py-3 font-bold w-1/4 text-left">Description</th>
            {currentStatus !== "EARNINGS" && (
              <th className="px-4 py-3 font-bold w-1/4 text-left">Details</th>
            )}
            <th className="px-4 py-3 font-bold w-1/4 text-left">Type</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2b2b2b] text-white font-medium">
          {data.map((item) => {
            const isFailed =
              item.company_transaction_description.includes("FAILED");

            return (
              <tr
                key={item.company_transaction_id}
                className="hover:bg-[#1f1f1f] transition-colors"
              >
                <td
                  className={`px-4 py-3 font-bold ${
                    isFailed ? "text-red-400" : "text-green-400"
                  } whitespace-nowrap`}
                >
                  ₱ {formatNumberLocale(item.company_transaction_amount ?? 0)}
                </td>
                <td className="px-4 py-3 text-gray-400 w-[180px] whitespace-nowrap">
                  {formateMonthDateYearv2(item.company_transaction_date)}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {item.company_transaction_description}
                </td>
                {currentStatus !== "EARNINGS" && (
                  <td className="px-4 py-3 text-orange-500 text-xs truncate">
                    {item.company_transaction_details
                      ?.split(",")
                      .map((line, idx) => (
                        <p key={idx} className="text-sm text-white">
                          {line.trim()}
                        </p>
                      ))}
                  </td>
                )}
                <td className="px-4 py-3 text-orange-500 uppercase text-xs truncate">
                  {item.company_transaction_type}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex items-center justify-end gap-x-4 py-4 px-4">
        {activePage > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActivePage((prev) => Math.max(prev - 1, 1))}
            className="bg-orange-950 text-white hover:bg-orange-600 transition-all duration-200 rounded-lg shadow-md"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        <div className="flex space-x-2">
          {(() => {
            const maxVisiblePages = 3;
            const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
            let displayedPages = [];

            if (pageCount <= maxVisiblePages) {
              displayedPages = pages;
            } else {
              if (activePage <= 2) {
                displayedPages = [1, 2, 3, "...", pageCount];
              } else if (activePage >= pageCount - 1) {
                displayedPages = [
                  1,
                  "...",
                  pageCount - 2,
                  pageCount - 1,
                  pageCount,
                ];
              } else {
                displayedPages = [
                  activePage - 1,
                  activePage,
                  activePage + 1,
                  "...",
                  pageCount,
                ];
              }
            }

            return displayedPages.map((page, index) =>
              typeof page === "number" ? (
                <Button
                  key={page}
                  onClick={() => setActivePage(page)}
                  size="sm"
                  className={`${
                    activePage === page
                      ? "bg-orange-500 text-zinc-900 font-bold shadow-md"
                      : "border border-zinc-700 text-zinc-300 hover:bg-orange-500 hover:text-white bg-zinc-900"
                  } rounded-lg px-3 py-2 transition-all duration-200`}
                >
                  {page}
                </Button>
              ) : (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-1 text-zinc-600 dark:text-zinc-400"
                >
                  {page}
                </span>
              )
            );
          })()}
        </div>

        {activePage < pageCount && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setActivePage((prev) => Math.min(prev + 1, pageCount))
            }
            className="bg-orange-500 text-white hover:bg-orange-600 transition-all duration-200 rounded-lg shadow-md"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default HistoryCardList;
