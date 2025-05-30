import { formatDateToYYYYMMDD, formatTime } from "@/utils/function";
import { user_table } from "@prisma/client";
import { ColumnDef, Row } from "@tanstack/react-table";

export const AllyBountyColumn = (
  viewAllReferrals: boolean
): ColumnDef<
  user_table & {
    total_bounty_earnings: string;
    package_ally_bounty_log_date_created: Date;
    company_referral_date: Date;
  }
>[] => {
  return [
    ...(!viewAllReferrals
      ? [
          {
            // Index column
            id: "package_ally_bounty_log_date_created",
            header: () => (
              <div className="text-start text-xs font-bold p-0">Date</div>
            ),
            cell: ({
              row,
            }: {
              row: Row<
                user_table & {
                  total_bounty_earnings: string;
                  package_ally_bounty_log_date_created: Date;
                  company_referral_date: Date;
                }
              >;
            }) => (
              <div className="text-start text-[10px] sm:text-[12px]">
                {formatDateToYYYYMMDD(
                  row.original?.package_ally_bounty_log_date_created ||
                    new Date()
                )}
                ,{" "}
                {formatTime(
                  row.original?.package_ally_bounty_log_date_created ||
                    new Date()
                )}
              </div>
            ),
          },
        ]
      : []),
    {
      accessorKey: "user_username",
      header: () => (
        <div className="text-start text-xs font-bold p-0">Username</div>
      ),
      cell: ({ row }) => (
        <div className="text-start text-[10px] sm:text-[12px]">
          {row.getValue("user_username")}
        </div>
      ),
    },
    ...(!viewAllReferrals
      ? [
          {
            accessorKey: "total_bounty_earnings",
            header: () => (
              <div className="text-start text-xs font-bold p-0">Amount</div>
            ),
            cell: ({
              row,
            }: {
              row: Row<
                user_table & {
                  total_bounty_earnings: string;
                  package_ally_bounty_log_date_created: Date;
                  company_referral_date: Date;
                }
              >;
            }) => (
              <div className="text-start text-[10px] sm:text-[12px]">
                ₱{" "}
                {Number(row.getValue("total_bounty_earnings")).toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </div>
            ),
          },
        ]
      : []),
    {
      accessorKey: "company_referral_date",
      header: () => (
        <div className="text-start font-bold text-xs p-0">Invite Date</div>
      ),
      cell: ({ row }) => (
        <div className="text-start text-[10px] sm:text-[12px]">
          {formatDateToYYYYMMDD(row.original?.company_referral_date)}
        </div>
      ),
    },
  ];
};
