import { package_table } from "@prisma/client";

export const getAdminPackages = async () => {
  const response = await fetch(`/api/v1/package/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "An error occurred while creating the top-up request."
    );
  }

  const { data } = result;

  return data as package_table[];
};

export const createPackage = async (params: {
  packageName: string;
  packageDescription: string;
  packagePercentage: string;
  packageDays: string;
  packageImage: string;
  packageColor: string;
}) => {
  const response = await fetch(`/api/v1/package/create`, {
    method: "POST",
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

  const { data } = result;

  return data;
};
