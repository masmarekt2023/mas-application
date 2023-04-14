import { create } from "zustand";
import axios from "axios";
import Apiconfigs from "./Apiconfigs";

const useStoryData = create((set, get) => ({
  isLoading: false,

  // Get Story for user
  userStories: [],
  getStory: async (token, userId) => {
    set({ isLoading: true });
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.story + userId,
        headers: {
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
        set({userStories: res.data.result})
      }
    } catch (e) {
      console.log("Error in useStoryData / getStory");
    }
    set({ isLoading: false });
  },

  // Get Story for user
  storyArr: [],
  getAllStories: async (token, userId) => {
    set({ isLoading: true });
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.getAllStories + userId,
        headers: {
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
          set({storyArr: res.data.result});
      }
    } catch (e) {
      console.log("Error in useStoryData / getStory");
      console.log(e);
    }
    set({ isLoading: false });
  },

  // Add story
  addStory: async (token, file, userId) => {
    set({ isLoading: true });
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios({
        method: "POST",
        url: Apiconfigs.story,
        headers: {
          token: token,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      if (res.data.statusCode === 200) {
        get().getStory(token, userId);
      }
    } catch (e) {
      console.log("Error in useStoryData / addStory");
      console.log(e);
    }
  },

  // Like story
  userLikedStories: [],
  likeDislikeStory: async (token, storyId, userId) => {
    try {
      const res = await axios({
        method: "PUT",
        url: Apiconfigs.likeDislikeStory + storyId,
        headers: {
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
        const result = res.data.result;
        set((state) => ({
          userLikedStories: result.likeUsers.includes(userId)
            ? [...state.userLikedStories, result._id]
            : state.userLikedStories.filter((i) => i !== result._id),
        }));
      }
    } catch (e) {
      console.log("Error in useStoryData / likeDislikeStory");
    }
  },

  // Delete Story
  deleteStory: async (token, storyId, userId) => {
    try {
      const res = await axios({
        method: "DELETE",
        url: Apiconfigs.story + storyId,
        headers: {
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
        get().getStory(token, userId);
      }
    } catch (e) {
      console.log("Error in useStoryData / deleteStory");
    }
  },
}));

export default useStoryData;
