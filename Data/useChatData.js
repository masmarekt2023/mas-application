import { create } from "zustand";
import Apiconfigs from "./Apiconfigs";
import axios from "axios";

const useChatData = create((set, get) => ({
  isLoading: false,
  onlineUsers: [],
  setOnlineUser: (arr) => set({ onlineUsers: arr }),

  // Get Chat list
  unreadMessages: [
    {
      chatId: "",
      creatorId: "",
      messages: [],
    },
  ],
  readUserChat: (chatId) =>
    set((state) => ({
      unreadMessages: state.unreadMessages.map((i) =>
        i.chatId === chatId
          ? {
              ...i,
              messages: [],
            }
          : i
      ),
    })),
  setUnReadMessages: (message) =>
    set((state) => ({
      unreadMessages: state.unreadMessages.map((i) =>
        i.chatId === message.chat
          ? {
              ...i,
              messages: [...i.messages, message],
            }
          : i
      ),
    })),
  chatsIds: [],
  chatCreatorsId: [],
  setChatCreatorsId: (creatorId) =>
    set((state) => ({ chatCreatorsId: [...state.chatCreatorsId, creatorId] })),
  getChatList: async (token, userId) => {
    set({ isLoading: true });
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.chatList,
        headers: {
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
        set({
          chatCreatorsId: res.data.result.map(
            (item) => item.users.filter((item2) => item2._id !== userId)[0]?._id
          ),
        });
        set({ chatsIds: res.data.result.map((i) => i._id) });
        set({
          unreadMessages: res.data.result.map((i) => ({
            chatId: i._id,
            creatorId: i.users.filter((item2) => item2._id !== userId)[0]?._id,
            messages: [],
          })),
        });
      }
    } catch (error) {
      console.log(error);
      console.log("Error in useChatData / getChatList");
    }
    set({ isLoading: false });
  },

  // Get user Chat
  userChat: [],
  getUserChat: async (token, chatId) => {
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.viewChat + chatId,
        params: {
          limit: 100,
        },
        headers: {
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
        set({ userChat: res.data.result });
      }
    } catch (error) {
      console.log("Error in useChatData / getUserChat");
    }
  },

  // Read messages
  readMessages: async (token, chatId, messagesIds) => {
    try {
      const res = await axios({
        method: "POST",
        url: Apiconfigs.readChat,
        data: {
          chat: chatId,
          ids: String(messagesIds),
        },
        headers: {
          token: token,
        },
      });
      console.log(res.data);
    } catch (e) {
      console.log("Error in useChatData / readMessages");
    }
  },

  // Creat A New Chat
  newChatId: "",
  creatNewChat: async (token, creatorId) => {
    try {
      const res = await axios({
        method: "POST",
        url: Apiconfigs.initChat,
        data: {
          user: creatorId,
        },
        headers: {
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
        get().getUserChat(token, res.data.result._id);
        set({ newChatId: res.data.result._id });
      } else {
        console.log(res.data.responseMessage);
      }
    } catch (e) {
      console.log("Error in useChatData / creatNewChat");
    }
  },

  // Upload Image
  chatImageUrl: "",
  setChatImageUrl: () => set({chatImageUrl: ""}),
  uploadImage: async (token, img) => {
    const formData = new FormData();
    formData.append("path", img );
    try {
      const res = await axios({
        method: "POST",
        url: Apiconfigs.chatUploadImage,
        data: formData,
        headers: {
          Accept: 'application/json',
          "Content-Type": "multipart/form-data",
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
        set({chatImageUrl: res.data.result});
      }
    } catch (e) {
      console.log("Error in useChatData / uploadMessage");
    }
  },
}));

export default useChatData;
