import { create } from "zustand";
import Apiconfigs from "./Apiconfigs";
import axios from "axios";

const useCreatorsData = create((set) => ({
  isLoading: false,
  creatorsList: [],
  getCreators: async (token, userId) => {
    set({ isLoading: true });
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.latestUserList,
        params: {
          limit: 10,
          userType: "Creator",
        },
        headers: {
          token: token,
        },
      });
      if(res.data.statusCode === 200){
        set({creatorsList: res.data.result.docs.filter(i => i._id !== userId)})
      }
    } catch (e) {
      console.log(error);
    }

    set({ isLoading: false });
  },
}));

export default useCreatorsData;
