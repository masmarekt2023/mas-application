import { create } from "zustand";
import Apiconfigs from "./Apiconfigs";
import axios from "axios";
import apiconfigs from "./Apiconfigs";
import { localAlert } from "../components/localAlert";

const useBundlesData = create((set) => ({
  isLoading: false,
  setLoading: (status) => set({ isLoading: status }),

  bundlesList: [],
  myBundlesList: [],
  likesUser: [],
  subscribesUser: [],
  getBundles: async (userId) => {
    set({ isLoading: true });
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.listAllNft,
        params: {
          limit: 8,
        },
      });
      if (res.data.statusCode === 200) {
        set({
          bundlesList: res.data.result.docs.filter(
            (i) => i.userId._id !== userId
          ),
        });
        set({
          myBundlesList: res.data.result.docs.filter(
            (i) => i.userId._id === userId
          ),
        });
        set({
          likesUser: res.data.result.docs
            .map((i) => (i.likesUsers.includes(userId) ? i._id : 1))
            .filter((i) => i !== 1),
        });
        set({
          subscribesUser: res.data.result.docs
            .map((i) => (i.subscribers.includes(userId) ? i._id : 1))
            .filter((i) => i !== 1),
        });
      }
    } catch (e) {
      console.log(error);
    }
    set({ isLoading: false });
  },

  // Creat Bundle
  createBundle: async (token, data, navigation) => {
    set({ isLoading: true });
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("tokenName", data.bundleName);
    formData.append("bundleTitle", data.bundleTitle);
    formData.append("bundleName", data.bundleName);
    formData.append("duration", data.duration);
    formData.append("details", data.details);
    formData.append("donationAmount", `${data.donationAmount}`);
    formData.append("coinName", data.coinName);
    try {
      const res = await axios({
        method: "POST",
        url: Apiconfigs.addNft,
        data: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
        navigation.push("NFTUploadSuccess", {
          message: "You have successfully added a bundle for sale",
        });
      } else {
        console.log("Error in useBundlesData/createBundle");
      }
    } catch (e) {
      console.log("Error in useBundlesData/createBundle");
      console.log(e);
    }
    set({ isLoading: false });
  },

  // Edit Bundle
  editBundle: async (token, data, navigation) => {
    set({ isLoading: true });
    const formData = new FormData();
    formData.append("_id", data.bundleId);
    formData.append("mediaUrl", data.file);
    try {
      const res = await axios({
        method: "PUT",
        url: Apiconfigs.editNft,
        data: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
        navigation.push("NFTUploadSuccess", {
          message: "You have successfully updated your bundle.",
        });
      }
    } catch (e) {
      console.log("Error in useBundlesData / editBundle");
    }
    set({ isLoading: false });
  },

  // Bundle Content List
  bundleContentList: [],
  getBundleContentList: async (token, bundleId) => {
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.bundleContentList,
        params: {
          nftId: bundleId,
          //search: selectedFilter.searchKey ? selectedFilter.searchKey : null,
          //fromDate: selectedFilter.startDate ? selectedFilter.startDate : null,
          //toDate: selectedFilter.endDate ? selectedFilter.endDate : null,
        },
        headers: {
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
        set({ bundleContentList: res.data.result.docs });
      }
    } catch (e) {
      console.log("Error in useBundlesData / getBundleContentList");
    }
  },

  // Share for audience
  shareForAudience: async (token, data, navigation) => {
    set({ isLoading: true });
    const formData = new FormData();
    formData.append("mediaUrl", data.file);
    formData.append("title", data.title);
    formData.append("details", data.details);
    formData.append("postType", data.type);
    formData.append("nftIds", JSON.stringify(data.bundleIds));
    try {
      const res = await axios({
        method: "POST",
        url: Apiconfigs.share,
        data: formData,
        headers: {
          token: token,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res.data);
      if (res.data.statusCode === 200) {
        navigation.push("NFTUploadSuccess", {
          message: "You have successfully shared a Audience",
        });
      } else {
        console.log("Error in useBundlesData/shareForAudience");
      }
    } catch (e) {
      console.log("Error in useBundlesData/shareForAudience");
    }
    set({ isLoading: false });
  },

  // Update like dislike Bundles
  updateBundlesLikeData: async (token, id) => {
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.likeDislikeNft + id,
        headers: {
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
        set((state) => {
          if (state.likesUser.includes(id)) {
            return { likesUser: state.likesUser.filter((i) => i !== id) };
          } else {
            return { likesUser: [...state.likesUser, id] };
          }
        });
      } else {
        console.log("Error in useLikeData/updateBundlesLikeData");
      }
    } catch (e) {
      console.log("Error in useLikeData/updateBundlesLikeData");
    }
  },

  // Subscribe Bundle
  subscribeToBundle: async (token, id) => {
    set({ isLoading: true });
    try {
      const res = await axios({
        method: "GET",
        url: apiconfigs.subscribeNow + id,
        headers: {
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
        set((state) => ({ subscribesUser: [...state.subscribesUser, id] }));
        localAlert("You have subscribed successfully.");
      } else {
        localAlert(res.data.responseMessage);
      }
    } catch (e) {
      console.log(e);
      console.log("Error in useSubscribeData/subscribeToBundle");
    }
    set({ isLoading: false });
  },

  // unSubscribe Bundle
  /*unSubscribeToBundle: async (token, id) => {
    try {
      const res = await axios({
        method: "DELETE",
        url: Apiconfigs.unSubscription + id,
        headers: {
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
        set((state) => ({
          subscribesUser: state.subscribesUser.filter((i) => i !== id),
        }));
        localAlert("You have unsubscribed successfully.");
      } else {
        localAlert("Something went wrong");
      }
    } catch (e) {
      console.log("Error in useSubscribeData/subscribeToBundle");
    }
  },*/
}));

export default useBundlesData;
