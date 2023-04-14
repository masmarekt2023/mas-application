import { create } from "zustand";
import Apiconfigs from "./Apiconfigs";
import axios from "axios";

import { localAlert } from "../components/localAlert";

const useVerificationData = create((set) => ({
  isLoading: false,
  sendOpt: async (token, channel, context) => {
    try {
      const res = await axios({
        method: "POST",
        url: Apiconfigs.sendOtp,
        data: {
          channel: channel,
          context: context,
        },
        headers: {
          token: token,
        },
      });
      if (res.data.statusCode === 200) {
        localAlert(res.data.responseMessage);
      } else {
        localAlert(res.data.responseMessage);
      }
    } catch (error) {
      console.log("Error in useVerificationData / sendOpt");
    }
  },
  verificationOtp: async (code, navigation, token, channel, context) => {
    set({ isLoading: true });
    try {
      const res = await axios({
        method: "POST",
        url: Apiconfigs.verifyOtp,
        data: {
          otp: code,
          channel: channel,
          context: context,
          txid: null,
        },
        headers: {
          token: token,
        },
      });
      if (res.data.result.verified) {
        navigation.push("BottomTabBar");
      } else {
        localAlert(res.data.responseMessage);
      }
    } catch (err) {
      console.log("Error in useVerificationData / verificationOtp");
    }
    set({ isLoading: false });
  },
}));

export default useVerificationData;
