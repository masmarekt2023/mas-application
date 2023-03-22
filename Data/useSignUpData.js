import { create } from "zustand";
import Apiconfigs from "./Apiconfigs";
import axios from "axios";

import { showMessage } from "react-native-flash-message";

const useSignUpData = create((set) => ({
  isLoading: false,
  SignUp: async (data, navigation) => {
    set({ isLoading: true });
    try {
      const res = await axios({
        method: "POST",
        url: Apiconfigs.register,
        data: {
          userName: data.username,
          password: data.password,
          email: data.email,
          phone: data.phoneNumber,
          referralCode: "",
          otp: data.otp,
        },
      });
      if (res.data.statusCode === 200) {
        showMessage({
          message: res.data.responseMessage,
          type: "success",
          titleStyle: { fontWeight: "bold", fontSize: 16 },
        });
        navigation.push("SignUpSuccess");
      } else {
        showMessage({
          message: res.data.responseMessage,
          type: "danger",
          titleStyle: { fontWeight: "bold", fontSize: 16 },
        });
      }
    } catch (error) {
      console.log("Error in sign up");
    }
    set({ isLoading: false });
  },
  sendOtpRegister: async (data, navigation) => {
    set({ isLoading: true });
    try {
      const res = await axios({
        method: "POST",
        url: Apiconfigs.sendOtpRegister,
        data: {
          email: data.email,
        },
      });
      if (res.data.statusCode === 200) {
        showMessage({
          message: "Send otp code successfully",
          type: "success",
          titleStyle: { fontWeight: "bold", fontSize: 16 },
        });
        navigation.push("Verification", {
          channel: "email",
          context: "register",
          data: data,
        });
      }
    } catch (e) {
      console.log("Error in useSignUp / sendOtpRegister");
    }
    set({ isLoading: false });
  },
}));

export default useSignUpData;
