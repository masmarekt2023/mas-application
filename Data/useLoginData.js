import { create } from "zustand";
import Apiconfigs from "./Apiconfigs";
import axios from "axios";

import { localAlert } from "../components/localAlert";

const useLoginData = create((set) => ({
  isLoading: false,
  userInfo: {
    isEmailVerified: false,
    isNewUser: false,
    isPhoneVerified: false,
    name: "mo619",
    token: "",
    userName: "",
  },
  Login: async (data, navigation) => {
    set({ isLoading: true });
    try {
      const res = await axios({
        method: "POST",
        url: Apiconfigs.userlogin,
        data: {
          email: `${data.email.charAt(0).toLowerCase()}${data.email.slice(1)}`,
          password: data.password,
        },
      });
      if (Object.entries(res.data.result).length > 0) {
        set({ userInfo: res.data.result });
        navigation.push("LoadingAfterLogin");
      } else {
        localAlert("User Not Found");
      }
    } catch (error) {
      if (error.response) {
        localAlert(error.response.data.responseMessage);
      } else {
        console.log(error.message);
      }
    }
    set({ isLoading: false });
  },
}));

export default useLoginData;
