import { showMessage } from "react-native-flash-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const localAlert = async (message) => {
  try {
    const value = await AsyncStorage.getItem("darkMode");
    if (value !== null && value === "on") {
      showMessage({
        message: message,
        type: "danger",
        style: { backgroundColor: "rgba(140,49,255,1)" },
        titleStyle: { fontWeight: "bold", fontSize: 16 },
      });
    } else {
      showMessage({
        message: message,
        type: "danger",
        style: { backgroundColor: "rgba(19,198,226,1)" },
        titleStyle: { fontWeight: "bold", fontSize: 16 },
      });
    }
  } catch (e) {
    console.log("Error in localAlert.js");
  }
};
