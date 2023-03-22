import React, { useEffect } from "react";
import { View } from "react-native";
import * as Font from "expo-font";
import useLocalData from "../Data/localData/useLocalData";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoadingScreen = ({ navigation }) => {
  const lightModeColor = useLocalData((state) => state.lightModeColor);
  const darkModeColors = useLocalData((state) => state.darkModeColors);
  const setDarkMode = useLocalData((state) => state.setDarkMode);

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        SF_Compact_Display_Regular: require("../assets/fonts/SF-Compact-Display-Regular.ttf"),
        SF_Compact_Display_Medium: require("../assets/fonts/SF-Compact-Display-Medium.ttf"),
        SF_Compact_Display_SemiBold: require("../assets/fonts/SF-Compact-Display-Semibold.ttf"),
        SF_Compact_Display_Bold: require("../assets/fonts/SF-Compact-Display-Bold.ttf"),
        SF_Compact_Display_Light: require("../assets/fonts/SF-Compact-Display-Light.ttf"),
        SF_Compact_Display_Thin: require("../assets/fonts/SF-Compact-Display-Thin.ttf"),
        SF_Compact_Display_Black: require("../assets/fonts/SF-Compact-Display-Black.ttf"),
      });
      navigation.navigate("Login");
    }

    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem("darkMode");
        if (value !== null) {
          value === "on"
            ? setDarkMode(true, darkModeColors)
            : setDarkMode(false, lightModeColor);
        } else {
          setDarkMode(false, lightModeColor);
        }
      } catch (e) {
        console.log("Error in LadingScreen.js");
      }
    };

    getData();
    loadFont();
  });

  return <View style={{ flex: 1, backgroundColor: "#ffffff" }} />;
};

export default LoadingScreen;