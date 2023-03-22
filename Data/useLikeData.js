import { create } from "zustand";
import Apiconfigs from "./Apiconfigs";
import axios from "axios";

const useLikeData = create((set) => ({
  isLoading: false,
  updateFeedLikeData: async (token, id) => {
    set({ isLoading: true });
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.likeDislikeFeed + id,
        headers: {
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
      } else {
        console.log("Error in useLikeData/updateFeedLikeData");
      }
    } catch (e) {
      console.log("Error in useLikeData/updateFeedLikeData");
    }
    set({ isLoading: false });
  },
}));

export default useLikeData;
