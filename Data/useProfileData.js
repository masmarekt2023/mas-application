import { create } from "zustand";
import Apiconfigs from "./Apiconfigs";
import axios from "axios";
import produce from "immer";
import { showMessage } from "react-native-flash-message";

const useProfileData = create((set) => ({
  isLoading: false,

  // Profile Data
  userData: {
    name: "",
    userId: "",
    email: "",
    emailVerification: false,
    phone: "",
    phoneVerification: false,
    imageCover: "",
    userImage: "",
    userName: "",
    userType: "",
    description: "",
    bio: "",
    masBalance: 0,
    busdBalance: 0,
    usdtBalance: 0,
    bnbBalance: 0,
    referralBalance: 0,
    walletAddress: "",
    referralCode: "",
    subscribes: 0,
    likes: 0,
    facebook: "",
    telegram: "",
    twitter: "",
    youtube: "",
  },
  getProfile: async (token) => {
    set({ isLoading: true });
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.profile,
        headers: {
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
        const result = res?.data?.userDetails;
        console.log(result.likesUsers);
        set(
          produce((state) => {
            state.userData.userImage = result.profilePic
              ? result.profilePic
              : "";
            state.userData.imageCover = result.coverPic ? result.coverPic : "";
            state.userData.userName = result?.userName;
            state.userData.name = result?.name;
            state.userData.email = result?.email;
            state.userData.emailVerification = result?.emailVerification;
            state.userData.phone = result?.phone;
            state.userData.phoneVerification = result?.phoneVerification;
            state.userData.userType = result?.userType;
            state.userData.facebook = result?.facebook;
            state.userData.telegram = result?.telegram;
            state.userData.youtube = result?.youtube;
            state.userData.twitter = result?.twitter;
            state.userData.description = result.speciality
              ? result.speciality
              : "";
            state.userData.bio = result?.bio;
            state.userData.userId = result._id;
            state.userData.referralCode = result.referralCode;
            state.userData.masBalance = result.masBalance;
            state.userData.busdBalance = result.busdBalance;
            state.userData.usdtBalance = result.usdtBalance;
            state.userData.walletAddress = result.walletAddress;
            state.userData.subscribes = result.followers?.length;
            state.userData.likes = result.likesUsers?.length;
          })
        );
      } else {
        console.log("Error in useProfileData / getProfile");
      }
    } catch (error) {
      console.log("Error in useProfileData / getProfile");
    }
    set({ isLoading: false });
  },

  // Update Profile
  updateProfile: async (token, data, navigation) => {
    set({ isLoading: true });
    const formData = new FormData();
    formData.append("name", data.name);
    data.coverPic.uri !== ""
      ? formData.append("coverPicFile", data.coverPic)
      : null;
    data.profilePic.uri !== ""
      ? formData.append("profilePicFile", data.profilePic)
      : null;
    data.speciality !== ""
      ? formData.append("speciality", data.speciality)
      : null;
    data.bio !== "" ? formData.append("bio", data.bio) : null;
    data.facebook !== "" ? formData.append("facebook", data.facebook) : null;
    data.twitter !== "" ? formData.append("twitter", data.twitter) : null;
    data.youtube !== "" ? formData.append("youtube", data.youtube) : null;
    data.telegram !== "" ? formData.append("telegram", data.telegram) : null;
    try {
      const res = await axios({
        method: "PUT",
        url: Apiconfigs.updateProfile,
        data: formData,
        headers: {
          token: token,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.statusCode === 200) {
        showMessage({
          message: "Your profile has been updated successfully",
          type: "success",
          titleStyle: { fontWeight: "bold", fontSize: 16 },
        });
        navigation.push("BottomTabBar");
      } else {
        showMessage({
          message: res.data.responseMessage,
          type: "danger",
          titleStyle: { fontWeight: "bold", fontSize: 16 },
        });
      }
    } catch (e) {
      console.log(e);
      console.log("Error in useProfileData / updateProfile");
    }
    set({ isLoading: false });
  },

  // My Subscription data
  subscriptionBundles: [],
  subscriptionCreators: [],
  subscriptionLoading: false,
  getSubscription: async (token) => {
    set({ subscriptionLoading: true });
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.mysubscription,
        headers: {
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
        set({ subscriptionBundles: res.data.result });
      } else {
        console.log("Error in useProfileData / getSubscription");
      }
    } catch (e) {
      console.log("Error in useProfileData / getSubscription");
    }
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.profileFollowingList,
        headers: {
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
        set({ subscriptionCreators: res.data.result });
      } else {
        console.log("Error in useProfileData / getSubscription");
      }
    } catch (e) {
      console.log("Error in useProfileData / getSubscription");
    }
    set({ subscriptionLoading: false });
  },

  // My Feed data
  feedList: [],
  feedLoading: false,
  getFeed: async (token) => {
    set({ feedLoading: true });
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.myfeed,
        headers: {
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
        set({ feedList: res.data.result.public_Private.result });
      } else {
        console.log("Error in useProfileData / getSubscription");
      }
    } catch (e) {
      console.log("Error in useProfileData / getSubscription");
    }
    set({ feedLoading: false });
  },

  // Subscribers data
  subscribersList: [],
  subscribersLoading: false,
  getSubscribers: async (token) => {
    set({ subscribersLoading: true });
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.profileFollowersList,
        headers: {
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
        set({ subscribersList: res.data.result });
      } else {
        console.log("Error in useProfileData / getSubscribers");
      }
    } catch (e) {
      console.log("Error in useProfileData / getSubscribers");
    }
    set({ subscribersLoading: false });
  },

  // Donation Transaction List data
  donationTransactionList: [],
  donationTransactionLoading: false,
  getDonationTransactionList: async (token) => {
    set({ donationTransactionLoading: true });
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.donationTransactionlist,
        headers: {
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
        set({ donationTransactionList: res.data.result.docs });
      } else {
        console.log("Error in useProfileData / getDonationTransactionList");
      }
    } catch (e) {
      console.log("Error in useProfileData / getDonationTransactionList");
    }
    set({ donationTransactionLoading: false });
  },

  // Transaction History data
  transactionHistoryList: [],
  transactionHistoryLoading: false,
  getTransactionHistoryList: async (token) => {
    set({ transactionHistoryLoading: true });
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.transactionList,
        headers: {
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
        set({ transactionHistoryList: res.data.result.docs });
      } else {
        console.log("Error in useProfileData / getTransactionHistoryList");
      }
    } catch (e) {
      console.log("Error in useProfileData / getTransactionHistoryList");
    }
    set({ transactionHistoryLoading: false });
  },

  // Get Total Earnings
  totalEarnings: {
    masBalance: 0,
    usdtBalance: 0,
    busdBalance: 0,
    bnbBalance: 0,
  },
  getTotalEarnings: async (token) => {
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.totalEarnings,
        headers: {
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
        set((state) => ({
          totalEarnings: { ...res.data.result, ...state.totalEarnings },
        }));
      }
    } catch (error) {
      console.log("Error in useProfileData / getTotalEarnings");
    }
  },
}));

export default useProfileData;
