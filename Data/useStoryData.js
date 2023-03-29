import { create } from "zustand";
import axios from "axios";
import Apiconfigs from "./Apiconfigs";

const useStoryData = create((set, get) => ({
  isLoading: false,

  // Get Story for user
  storyArr: [],
  userLikedStories: [],
  getStory: async (token, userId, ourId) => {
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
        const result = res.data.result;
        result.forEach((i) => {
          if (i.likeUsers.includes(ourId))
            set((state) => ({
              userLikedStories: [...state.userLikedStories, i._id],
            }));
        });
        set((state) => {
          if (result !== []) {
            if (state.storyArr.find((i) => i.userId === userId)) {
              return {
                ...state,
                storyArr: state.storyArr.map((i) =>
                  i.userId === userId
                    ? {
                        userId: userId,
                        result: result,
                      }
                    : i
                ),
              };
            } else {
              return {
                ...state,
                storyArr: [
                  ...state.storyArr,
                  { userId: userId, result: result },
                ],
              };
            }
          }
        });
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
        get().getStory(token, userId, userId);
      }
    } catch (e) {
      console.log("Error in useStoryData / addStory");
      console.log(e);
    }
  },

  // Like story
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
        get().getStory(token, userId, userId);
      }
    } catch (e) {
      console.log("Error in useStoryData / deleteStory");
    }
  },
}));

export default useStoryData;
