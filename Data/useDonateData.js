import { create } from "zustand";
import Apiconfigs from "./Apiconfigs";
import axios from "axios";

const useDonateData = create((set) => ({
  isLoading: false,

  donation: async (token, data, navigation, navData) => {
    set({isLoading: true});
    try {
      const res = await axios({
        method: "POST",
        url: Apiconfigs.donation,
        headers: {
          token: token,
        },
        data: data,
      });
      if (res.data.statusCode === 200) {
        navigation.push("WalletSuccess", {
          ...navData,
          certificateID: res.data.result,
        });
      } else {
        console.log("Something went wrong!");
      }
    } catch (e) {
      console.log("Error in useWithdrawData / withdraw");
    }
    set({isLoading: false});
  },
}));

export default useDonateData;
