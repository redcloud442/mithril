import {
  adminSalesTotalReportData,
  AdminTopUpRequestData,
} from "@/utils/types";

export const getAdminTopUpRequest = async (params: {
  page: number;
  limit: number;
  search?: string;
  columnAccessor: string;
  isAscendingSort: boolean;
  merchantFilter?: string;
  userFilter?: string;
  statusFilter?: string;
  dateFilter?: {
    start: string | undefined;
    end: string | undefined;
  };
}) => {
  const response = await fetch(`/api/v1/deposit/list`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "An error occurred while creating the top-up request."
    );
  }

  return data as AdminTopUpRequestData;
};

export const updateTopUpStatus = async (params: {
  status: string;
  requestId: string;
  note?: string;
}) => {
  const { requestId } = params;

  const response = await fetch(`/api/v1/deposit/` + requestId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "An error occurred while creating the top-up request."
    );
  }

  return result as {
    updatedRequest: {
      company_deposit_request_id: string;
      company_deposit_request_amount: number;
      company_deposit_request_attachment_urls: string[];
      company_member_requestor: {
        company_member_user_id: string;
      };
    };
  };
};

export const getAdminTopUpTotalReport = async (params: {
  dateFilter: {
    month: string;
    year: string;
  };
}) => {
  const response = await fetch("/api/v1/deposit/report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const result = await response.json();

  if (!response.ok) throw new Error("Failed to fetch withdrawal total report");

  return result as adminSalesTotalReportData;
};
