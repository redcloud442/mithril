import { DashboardEarnings, HeirarchyData } from "@/utils/types";
import { company_earnings_table } from "@prisma/client";

export const getUserSponsor = async (params: { userId: string }) => {
  const response = await fetch(`/api/v1/user/sponsor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "An error occurred while fetching the earnings."
    );
  }

  return result as string;
};

export const getUserSponsorLink = async () => {
  const response = await fetch(`/api/v1/user/fb-link/sponsor`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "An error occurred while fetching the earnings."
    );
  }

  return result as {
    user_fb_link: string;
    user_username: string;
  };
};

export const getUserEarnings = async (params: { memberId: string }) => {
  const response = await fetch(`/api/v1/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "An error occurred while fetching the earnings."
    );
  }

  return result as {
    totalEarnings: DashboardEarnings;
    userEarningsData: company_earnings_table;
  };
};

export const getUserWithdrawalToday = async () => {
  const response = await fetch(`/api/v1/user`, {
    method: "GET",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "An error occurred while fetching the withdrawal."
    );
  }

  return result as {
    totalEarnings: DashboardEarnings;
    userEarningsData: company_earnings_table;
    actions: {
      canWithdrawReferral: boolean;
      canUserDeposit: boolean;
      canWithdrawPackage: boolean;
    };
  };
};

export const getNotificationCount = async (token: string) => {
  const response = await fetch(`/api/v2/notifications/get-count`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "An error occurred while fetching the notification count."
    );
  }

  return result as {
    notification_count: number;
  };
};

export const changeUserPassword = async (params: {
  userId: string;
  email: string;
  password: string;
}) => {
  const response = await fetch(
    `/api/v1/user/` + params.userId + `/change-password`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "An error occurred while changing the password."
    );
  }

  return result;
};

export const updateUserProfile = async (params: {
  userId: string;
  profilePicture: string;
}) => {
  const response = await fetch(`/api/v1/user/` + params.userId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "An error occurred while updating the profile."
    );
  }

  return result;
};

export const handleGenerateLink = async (params: {
  formattedUserName: string;
}) => {
  const response = await fetch(`/api/v1/user/generate-link`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "An error occurred while generating the link."
    );
  }

  return result;
};

export const getHeirarchy = async (params: { allianceMemberId: string }) => {
  const response = await fetch(`/api/v1/user/${params.allianceMemberId}/tree`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "An error occurred while fetching the heirarchy."
    );
  }

  return result as HeirarchyData[];
};

export const updateUserFacebookLink = async (params: {
  userId: string;
  facebookLink: string;
}) => {
  const response = await fetch(`/api/v1/user/` + params.userId + "/fb-link", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fbLink: params.facebookLink,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "An error occurred while updating the Facebook link."
    );
  }

  return result;
};
