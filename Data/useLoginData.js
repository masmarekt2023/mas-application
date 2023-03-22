import {create} from "zustand";
import Apiconfigs from "./Apiconfigs";
import axios from "axios";

import {showMessage} from "react-native-flash-message";

const useLoginData = create((set, get) => ({
    isLoading: false, userInfo: {
        isEmailVerified: true,
        isNewUser: false,
        isPhoneVerified: true,
        name: "mo619",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MTdhN2M4NTRjNjQ4MGJkZThjYzFjMiIsImVtYWlsIjoibW9oYW1tZWRyYWR3YW5yaXplQGdtYWlsLmNvbSIsInVzZXJUeXBlIjoiQ3JlYXRvciIsImlhdCI6MTY3OTQzNDYxOCwiZXhwIjoxNjc5NTIxMDE4fQ.HOdYhYDCUGtfSeIJkWojh-KqkMtbBpqPrdBybzGMMyU",
        userName: "mo619"
    }, Login: async (data, navigation) => {
        set({isLoading: true});
        try {
            const res = await axios({
                method: "POST", url: Apiconfigs.userlogin, data: data,
            });
            if (Object.entries(res.data.result).length > 0) {
                console.log(res.data.result);
                set({userInfo: res.data.result});
                if (!get().userInfo.isEmailVerified || !get().userInfo.isPhoneVerified) {
                    // navigation.push("EditProfile"); => I will solve this problem
                    navigation.push("BottomTabBar");
                } else {
                    navigation.push("BottomTabBar");
                }
            } else {
                showMessage({
                    message: res.data.responseMessage, type: "danger", titleStyle: {fontWeight: 'bold', fontSize: 16}
                });
            }
        } catch (error) {
            if (error.response) {
                showMessage({
                    message: error.response.data.responseMessage,
                    type: "danger",
                    titleStyle: {fontWeight: 'bold', fontSize: 16}
                });
            } else {
                console.log(error.message);
            }
        }
        set({isLoading: false});
    },
}));

export default useLoginData;
