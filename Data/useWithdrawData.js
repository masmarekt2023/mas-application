import { create } from "zustand";
import Apiconfigs from "./Apiconfigs";
import axios from "axios";
import { localAlert } from "../components/localAlert";

const useWithdrawData = create((set, get) => ({
  isLoading: false,
  txId: "",
  withdraw: async (token, data, navigation, withdrawData) => {
    try {
      const res = await axios({
        method: "POST",
        url: Apiconfigs.withdraw,
        headers: {
          token: token,
        },
        data: data,
      });
      if (res.data.statusCode === 201) {
        set({ txId: res.data.result.txid });
        navigation.push("Verification", {
          token: token,
          channel: "sms",
          context: "withdraw",
          withdrawData: { ...withdrawData, txid: res.data.result.txid },
        });
      } else {
        console.log("Something went wrong!");
      }
    } catch (e) {
      console.log("Error in useWithdrawData / withdraw");
    }
  },
  verificationWithdraw: async (code, navigation, token, data) => {
    set({ isLoading: true });
    try {
      const res = await axios({
        method: "POST",
        url: Apiconfigs.verifyOtp,
        data: {
          otp: code,
          channel: "sms",
          context: "withdraw",
          txid: get().txId,
        },
        headers: {
          token: token,
        },
      });
      console.log(res.data);
      if (res.data.statusCode === 200) {
        navigation.push("WithdrawSuccess", { ...data });
      } else {
        localAlert(res.data.responseMessage);
      }
    } catch (err) {
      console.log("Error in useVerificationData / verificationOtp");
    }
    set({ isLoading: false });
  },
}));

export default useWithdrawData;

/*

{
      "__v": 0,
      "_id": "6413f564b67ab710fd14cdb6",
      "adminCommission": 0.0115,
      "amount": 1.15,
      "coinName": "MAS",
      "createdAt": "2023-03-17T05:06:44.451Z",
      "email_security_verification": false,
      "recipientAddress": "0xb2c61a497823eb3b1d8cba52a94b27fd1caa8789",
      "sms_security_verification": true,
      "status": "ACTIVE",
      "transactionStatus": "PROCESSING",
      "transactionType": "Withdraw",
      "updatedAt": "2023-03-17T05:07:01.446Z",
      "userId": "6412c8260d6de917be762690",
    }

*/

/*
userName *,
    userWallet *,
    coinAmount = amount,
    coinName = coinName,
    creatorName = "",
    creatorWallet = recipientAddress,
    certificateID,
*/
