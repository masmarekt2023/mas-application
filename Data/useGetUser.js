import { create } from "zustand";
import axios from "axios";
import Apiconfigs from "./Apiconfigs";

const useGetUser = create((set) => ({
  isLoading: false,
  getUser: async (token, navigation, userName) => {
    set({ isLoading: true });
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.getUser + userName,
        headers: {
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
        const result = res.data.result[0];
        const userData = {
            userImage: result.profilePic
                ? result.profilePic
                : "",
            userName: result?.userName,
            name: result?.name,
            userType: result?.userType,
            description: result.speciality
                ? result.speciality
                : "",
            youtube: result.youtube ? result.youtube : "",
            telegram: result.telegram ? result.telegram : "",
            facebook: result.facebook ? result.facebook : "",
            twitter: result.twitter ? result.twitter : "",
            walletAddress: result?.walletAddress,
            subscribers: result.followers,
            likers: result.likesUsers,
            supporters: result.supporters,
            bundles: result.bundleDetails?.length,
            masBalance: result.masBalance
                ? result.masBalance
                : 0,
            creatorId: result._id,
            userBundles: result.bundleDetails,
        }
        navigation.push("CreatorProfile", {userData: userData});
      } else {
        console.log("Error in useGetUser");
      }
    } catch (e) {
      console.log("Error in useGetUser");
    }
    set({ isLoading: false });
  },
}));

export default useGetUser;
