export const getRank = async (params: { company_member_id: string }) => {
  const { company_member_id } = params;

  const response = await fetch(`/api/v1/rank/` + company_member_id, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ company_member_id }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "An error occurred while getting the rank."
    );
  }

  return result;
};
