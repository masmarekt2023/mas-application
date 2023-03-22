import { create } from "zustand";
import Apiconfigs from "./Apiconfigs";
import axios from "axios";

import { showMessage } from "react-native-flash-message";

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
                    otp: data.code.slice(0,6),
                },
            });
            if (res.data.statusCode === 200) {
                showMessage({
                    message: res.data.responseMessage,
                    type: "success",
                    titleStyle: { fontWeight: "bold", fontSize: 16 },
                });
                navigation.push("PasswordUpdateSuccess");
            } else {
                showMessage({
                    message: res.data.responseMessage,
                    type: "danger",
                    titleStyle: { fontWeight: "bold", fontSize: 16 },
                });
            }
        } catch (error) {
            console.log(data.code);
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
        set({ isLoading: false });
    },
}));

export default useResetPasswordData;
