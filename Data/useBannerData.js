import { create } from "zustand";
import Apiconfigs from "./Apiconfigs";
import axios from "axios";

const useBannerData = create((set) => ({
  isLoading: false,
  bannerList: [],

  getBannerList: async (token) => {
    set({ isLoading: true });
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.listBanner,
        headers: {
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
        set({ bannerList: res.data.result.docs });
      } else {
        console.log("Something went wrong!");
      }
    } catch (e) {
      console.log("Error in useBannerData / getBannerList");
    }
    set({ isLoading: false });
  },
}));

export default useBannerData;
