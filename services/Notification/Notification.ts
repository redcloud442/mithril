export const SendNotification = async (
  params: {
    mode: "sendToAll" | "sendToUser";
    userIds: string[];
    title: string;
    description: string;
    imageUrl: string[];
  },
  token: string
) => {
  const res = await fetch("/api/v2/notifications/send", {
    method: "POST",
    body: JSON.stringify(params),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to submit notification");

  const data = await res.json();

  return data;
};

export const BroadcastNotification = async (
  params: {
    mode: "sendToAll" | "sendToUser";
    userIds: string[];
    title: string;
    description: string;
    imageUrl: string[];
  },
  token: string
) => {
  const res = await fetch("/api/v2/notifications/broadcast", {
    method: "POST",
    body: JSON.stringify(params),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to submit notification");

  const data = await res.json();

  return data;
};

export const getNotifications = async (
  token: string,
  take: number,
  skip: number
) => {
  const res = await fetch(
    `/api/v2/notifications/get-all?take=${take}&skip=${skip}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) throw new Error("Failed to get notifications");

  const data = await res.json();

  return data as {
    notification: {
      notification_id: string;
      notification_title: string;
      notification_message: string;
      notification_image_url: string[];
      notification_created_at: string;
      notification_is_read: boolean;
    }[];
    notification_count: number;
  };
};
