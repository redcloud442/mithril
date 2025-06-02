import {
  company_deposit_request_table,
  company_member_table,
  company_transaction_table,
  company_withdrawal_request_table,
  dashboard_earnings_summary,
  merchant_member_table,
  user_history_log,
  user_table,
} from "@prisma/client";

export type RegisterFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type TopUpRequestData = company_deposit_request_table & {
  user_username: string;
  user_first_name: string;
  user_last_name: string;
  user_email: string;
  user_id: string;
  approver_username: string;
  company_member_id: string;
  count: number;
};

export type PackageHistoryData = {
  package_member_connection_id: string;
  package_name: string;
  package_member_amount: number;
  package_member_amount_earnings: number;
  package_member_status: string;
  package_member_connection_created: string;
};

export type WithdrawalRequestData = company_withdrawal_request_table & {
  user_first_name: string;
  user_last_name: string;
  user_id: string;
  user_email: string;
  company_member_id: string;
  approver_username?: string;
};

export type UserRequestdata = user_table &
  company_member_table &
  merchant_member_table &
  dashboard_earnings_summary;

export type LegionRequestData = user_table &
  company_member_table & {
    total_bounty_earnings: string;
    package_ally_bounty_log_date_created: Date;
    company_referral_date: Date;
  };

export type UserLog = user_table & user_history_log;

export type ChartData = {
  date: string;
  earnings: number;
  withdraw: number;
};

export type ChartDataMember = {
  package: string;
  completion: number;
  completion_date: string;
  amount: number;
  is_ready_to_claim: boolean;
  package_connection_id: string;
  package_date_created: string;
  profit_amount: number;
  package_gif: string;
  package_image: string;
  package_member_id: string;
  package_days: number;
  current_amount: number;
  currentPercentage: number;
  package_percentage: number;
};

export type DashboardEarnings = {
  directReferralAmount: number;
  indirectReferralAmount: number;
  totalEarnings: number;
  packageEarnings: number;
  withdrawalAmount: number;
  directReferralCount: number;
  indirectReferralCount: number;
};

export type AdminDashboardDataByDate = {
  activePackageWithinTheDay: number;
  totalActivatedUserByDate: number;
  totalEarnings: number;
  totalWithdraw: number;
  directLoot: number;
  indirectLoot: number;
  totalApprovedWithdrawal: number;
  totalApprovedReceipts: number;
  packageEarnings: number;
  chartData: ChartData[];
  reinvestorsCount: number;
  totalReinvestmentAmount: number;
};

export type AdminDashboardData = {
  numberOfRegisteredUser: number;
  totalActivatedPackage: number;
  totalActivatedUser: number;
  totalSpinPurchase: number;
  totalSpinPurchaseCount: number;
  totalWinningWithdrawal: number;
};

export type AdminTopUpRequestData = {
  data: {
    APPROVED: StatusData;
    REJECTED: StatusData;
    PENDING: StatusData;
  };
  merchantBalance?: number;
  totalPendingDeposit?: number;
  totalApprovedDeposit?: number;
};

export type MerchantTopUpRequestData = {
  data: {
    APPROVED: StatusData;
    REJECTED: StatusData;
    PENDING: StatusData;
  };
  merchantBalance: number;
};

export type StatusData = {
  data: TopUpRequestData[];
  count: number;
};

export type StatusDataWithdraw = {
  data: WithdrawalRequestData[];
  count: number;
};

export type AdminWithdrawaldata = {
  data: {
    APPROVED: StatusDataWithdraw;
    REJECTED: StatusDataWithdraw;
    PENDING: StatusDataWithdraw;
  };
  totalPendingWithdrawal: number;
  totalApprovedWithdrawal: number;
};

export type AdminWithdrawalReportData = {
  total_amount: number;
  total_request: number;
};

export type adminWithdrawalTotalReportData = {
  interval_start: string;
  interval_end: string;
  total_accounting_approvals: string;
  total_admin_approvals: string;
  total_admin_approved_amount: number;
  total_accounting_approved_amount: number;
  total_net_approved_amount: number;
};

export type adminSalesTotalReportData = {
  monthlyTotal: number;
  monthlyCount: number;
  dailyIncome: adminSalesReportData[];
};

export type adminSalesReportData = {
  date: string;
  amount: number;
};

export type adminUserReinvestedReportData = {
  package_member_connection_created: string;
  package_member_amount: number;
  package_member_connection_id: string;
  user_username: string;
  user_id: string;
  user_profile_picture: string;
  user_first_name: string;
  user_last_name: string;
};

export type HeirarchyData = {
  company_member_id: string;
  user_username: string;
  user_id: string;
};

export type ModalGuide = {
  isModalOpen: boolean;
  type: "package" | "withdrawal";
};

export type WithdrawListExportData = {
  "Requestor Username": string;
  Status: string;
  Amount: number;
  "Bank Account": string;
  "Bank Name": string;
  "Account Number": string;
  "Withdrawal Type": string;
  "Date Created": string;
  "Date Updated": string;
  "Approved By": string;
};

export type HistoryData = {
  data: company_transaction_table[];
  count: number;
};
