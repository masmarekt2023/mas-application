import { create } from "zustand";
import axios from "axios";
import Apiconfigs from "./Apiconfigs";
import produce from "immer";

import { showMessage } from "react-native-flash-message";

const useGetUser = create((set, get) => ({
  username: "",
  userData: {
    creatorId: "",
    imageCover: "",
    userImage: "",
    userName: "",
    name: "",
    userType: "",
    description: "",
    walletAddress: "",
    subscribers: 0,
    likers: 0,
      supporters: 0,
    bundles: 0,
    masBalance: 0,
    userBundles: [],
    facebook: "",
    twitter: "",
    telegram: "",
    youtube: "",
  },
  setUsername: (username) => set({ username: username }),
  isLoading: false,
  getUser: async (token, navigation) => {
    set({ isLoading: true });
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.getUser + get().username,
        headers: {
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
        const result = res.data.result[0];
        set(
          produce((state) => {
            state.userData.userImage = result.profilePic
              ? result.profilePic
              : "";
            state.userData.userName = result?.userName;
            state.userData.name = result?.name;
            state.userData.userType = result?.userType;
            state.userData.description = result.speciality
              ? result.speciality
              : "";
            state.userData.youtube = result.youtube ? result.youtube : "";
            state.userData.telegram = result.telegram ? result.telegram : "";
            state.userData.facebook = result.facebook ? result.facebook : "";
            state.userData.twitter = result.twitter ? result.twitter : "";
            state.userData.walletAddress = result?.walletAddress;
            state.userData.subscribers = result.followers;
            state.userData.likers = result.likesUsers;
            state.userData.supporters = result.supporters;
            state.userData.bundles = result.bundleDetails?.length;
            state.userData.masBalance = result.masBalance
              ? result.masBalance
              : 0;
            state.userData.creatorId = result._id;
            state.userData.userBundles = result.bundleDetails;
          })
        );
        navigation.push("CreatorProfile");
      } else {
        showMessage({
          message: "User Not Found",
          type: "warning",
          titleStyle: { fontWeight: "bold", fontSize: 16 },
        });
        console.log("Error in useGetUser");
      }
    } catch (e) {
      showMessage({
        message: "User Not Found",
        type: "warning",
        titleStyle: { fontWeight: "bold", fontSize: 16 },
      });
      console.log("Error in useGetUser");
    }
    set({ isLoading: false });
  },
}));

export default useGetUser;
