import { CreateContactFormValues } from "@/utils/schema";

export const GetAllContacts = async (
  token: string,
  take: number,
  skip: number
) => {
  const response = await fetch(
    `/api/v2/contact/get-all?take=${take}&skip=${skip}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get all contacts");
  }

  const responseData = await response.json();

  return responseData as {
    contact: {
      contact_id: string;
      contact_name: string;
      contact_fb_link: string;
      contact_category: string;
      contact_user_id: string;
      contact_created_at: string;
    }[];
    total: number;
  };
};

export const CreateContact = async (
  data: CreateContactFormValues,
  token: string
) => {
  const response = await fetch(
    `http://localhost:4000/api/v2/contact/create-contact`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create contact");
  }

  const responseData = await response.json();

  return responseData;
};

export const DeleteContact = async (contactId: string, token: string) => {
  const response = await fetch(
    `http://localhost:4000/api/v2/contact/delete-contact/${contactId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create contact");
  }

  const responseData = await response.json();

  return responseData;
};
