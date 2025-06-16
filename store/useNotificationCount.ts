import { create } from "zustand";

interface notificationCountState {
  notificationCount: number;
  setNotificationCount: (notificationCount: number) => void;
  setNotificationToZero: () => void;
}

export const useNotificationCountStore = create<notificationCountState>(
  (set) => ({
    notificationCount: 0,
    setNotificationCount: (notificationCount) =>
      set(() => ({ notificationCount })),
    setNotificationToZero: () => set(() => ({ notificationCount: 0 })),
  })
);
