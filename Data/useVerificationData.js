import { create } from "zustand";
import Apiconfigs from "./Apiconfigs";
import axios from "axios";

import { showMessage } from "react-native-flash-message";

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
        showMessage({
          message: res.data.responseMessage,
          type: "success",
          titleStyle: { fontWeight: "bold", fontSize: 16 },
        });
      } else {
        showMessage({
          message: res.data.responseMessage,
          type: "danger",
          titleStyle: { fontWeight: "bold", fontSize: 16 },
        });
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
        showMessage({
          message: res.data.responseMessage,
          type: "danger",
          titleStyle: { fontWeight: "bold", fontSize: 16 },
        });
      }
    } catch (err) {
      console.log("Error in useVerificationData / verificationOtp");
    }
    set({ isLoading: false });
  },
}));

export default useVerificationData;
