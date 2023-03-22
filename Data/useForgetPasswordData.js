import { create } from "zustand";
import Apiconfigs from "./Apiconfigs";
import axios from "axios";

import { showMessage } from "react-native-flash-message";

const useForgetPasswordData = create((set) => ({
  isLoading: false,
  email: "",
  sendCode: async (data, navigation, navigationName) => {
    if(navigation) set({ isLoading: true });
    try {
      const res = await axios({
        method: "POST",
        url: Apiconfigs.forgotPassword,
        data: data,
      });
      if (res.data.statusCode === 200) {
        set({ email: data.email });
        showMessage({
          message: res.data.responseMessage,
          type: "success",
          titleStyle: { fontWeight: "bold", fontSize: 16 },
        });
        if(navigation) navigation.push(navigationName);
      } else {
        showMessage({
          message: res.data.responseMessage,
          type: "warning",
          titleStyle: { fontWeight: "bold", fontSize: 16 },
        });
      }
    } catch (error) {
      if (error.response) {
        showMessage({
          message: error.response.data.responseMessage,
          type: "danger",
          titleStyle: { fontWeight: "bold", fontSize: 16 },
        });
      } else {
        console.log(error.message);
      }
    }
    if(navigation) set({ isLoading: false });
  },
}));

export default useForgetPasswordData;
