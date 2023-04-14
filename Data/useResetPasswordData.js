import { create } from "zustand";
import Apiconfigs from "./Apiconfigs";
import axios from "axios";

import { localAlert } from "../components/localAlert";

const useResetPasswordData = create((set) => ({
  isLoading: false,
  resetPassword: async (data, navigation) => {
    set({ isLoading: true });
    try {
      const res = await axios({
        method: "POST",
        url: Apiconfigs.resetPassword,
        data: {
          email: data.email,
          password: data.password,
          otp: data.code.slice(0, 6),
        },
      });
      if (res.data.statusCode === 200) {
        localAlert(res.data.responseMessage);
        navigation.push("PasswordUpdateSuccess");
      } else {
        localAlert(res.data.responseMessage);
      }
    } catch (error) {
      console.log(data.code);
      if (error.response) {
        localAlert(error.response.data.responseMessage);
      } else {
        console.log(error.message);
      }
    }
    set({ isLoading: false });
  },
}));

export default useResetPasswordData;
