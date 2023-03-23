import { create } from "zustand";
import Apiconfigs from "./Apiconfigs";
import axios from "axios";

const useNotificationData = create((set) => ({
  isLoading: false,

  // Get All Notifications
  notificationsArr: [],
  setNotificationsArr: (notifications) =>
    set((state) => ({
      notificationsArr: [
        ...new Set([...notifications, ...state.notificationsArr]),
      ],
      isUnreadMessage: true
    })),
  getNotifications: async (token) => {
    set({ isLoading: true });
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.listNotification,
        headers: {
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
        set({ notificationsArr: res.data.result });
      }
    } catch (e) {
      console.log("Error in useNotificationData");
    }
    set({ isLoading: false });
  },

  // Remove Notification
  removeNotification: async (token, id) => {
    try {
      const res = await axios({
        method: "DELETE",
        url: Apiconfigs.removeNotification,
        params: {
          _id: id,
        },
        headers: {
          token: token,
        },
      });
    } catch (e) {
      console.log("Error in useNotificationData / removeNotification");
    }
  },

  // Read All Notification
  isUnreadMessage: false,
  setIsUnreadMessage: (status) => set({ isUnreadMessage: status }),
  readNotification: (token) => {
    try {
      axios
        .get(Apiconfigs.markAllNotificationsRead, {
          headers: {
            token: token,
          },
        })
        .then((res) => {
          if (res.data.result.ok === 1) {
            set({ unreadNotifications: false });
          }
        });
    } catch (error) {
      console.log("Error in useNotificationData / readNotification");
    }
  },
}));

export default useNotificationData;
