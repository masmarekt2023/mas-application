import { create } from "zustand";
import Apiconfigs from "./Apiconfigs";
import axios from "axios";

import { localAlert } from "../components/localAlert";

const useForgetPasswordData = create((set) => ({
  isLoading: false,
  email: "",
  sendCode: async (data, navigation, navigationName) => {
    if (navigation) set({ isLoading: true });
    try {
      const res = await axios({
        method: "POST",
        url: Apiconfigs.forgotPassword,
        data: data,
      });
      if (res.data.statusCode === 200) {
        set({ email: data.email });
        localAlert(res.data.responseMessage);
        if (navigation) navigation.push(navigationName);
      } else {
        localAlert(res.data.responseMessage);
      }
    } catch (error) {
      if (error.response) {
        localAlert(error.response.data.responseMessage);
      } else {
        console.log(error.message);
      }
    }
    if (navigation) set({ isLoading: false });
  },
}));

export default useForgetPasswordData;
