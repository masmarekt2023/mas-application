import { create } from "zustand";
import Apiconfigs from "./Apiconfigs";
import axios from "axios";

const useGetAllUsersData = create((set) => ({
  isLoading: false,
  allUsersList: [],
  creatorsWalletAddress: [],
  likesUser: [],
  subscribesUser: [],
  getAllUsers: async (userId) => {
    set({ isLoading: true });
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.allUserList,
        params: {
          limit: 100,
        },
      });
      if (res.data.statusCode === 200) {
        set({
          allUsersList: res.data.result.docs
            .filter((i) => i._id !== userId)
            .map((i) =>
              i.name
                ? i
                : {
                    ...i,
                    name: i.userName,
                    speciality: "",
                  }
            ),
        });
        set({
          creatorsWalletAddress: res.data.result.docs.map((i) => ({
            walletAddress: i.walletAddress,
            creatorName: i.name ? i.name : i.userName,
            creatorId: i._id,
          })),
        });
        set({
          likesUser: res.data.result.docs
            .map((i) => (i.likesUsers.includes(userId) ? i._id : 1))
            .filter((i) => i !== 1),
        });
        set({
          subscribesUser: res.data.result.docs
            .map((i) => (i.followers.includes(userId) ? i._id : 1))
            .filter((i) => i !== 1),
        });
      }
    } catch (error) {
      console.log(error);
    }
    set({ isLoading: false });
  },
  updateCreatorLikeData: async (token, id) => {
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.likeDislikeUser + id,
        headers: {
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
        set((state) => {
          if (state.likesUser.includes(id)) {
            return {
              likesUser: state.likesUser.filter((i) => i !== id),
            };
          } else {
            return { likesUser: [...state.likesUser, id] };
          }
        });
      } else {
        console.log("Error in useLikeData/updateCreatorLikeData");
      }
    } catch (e) {
      console.log("Error in useLikeData/updateCreatorLikeData");
    }
  },
  updateCreatorSubscribeData: async (token, id) => {
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.followProfile + id,
        headers: {
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
        set((state) => {
          if (state.subscribesUser.includes(id)) {
            return {
              subscribesUser: state.subscribesUser.filter((i) => i !== id),
            };
          } else {
            return { subscribesUser: [...state.subscribesUser, id] };
          }
        });
      } else {
        console.log(res.data.responseMessage);
      }
    } catch (e) {
      console.log("Error in useSubscribeData/updateCreatorSubscribeData");
    }
  },
}));

export default useGetAllUsersData;
