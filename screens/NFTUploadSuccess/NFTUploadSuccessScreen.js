import React, { useCallback } from "react";
import {
  BackHandler,
  SafeAreaView,
  View,
  StatusBar,
  Dimensions,
  Image,
  Text,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import useLocalData from "../../Data/localData/useLocalData";
import useBundlesData from "../../Data/useBundlesData";
import useProfileData from "../../Data/useProfileData";

const { width, height } = Dimensions.get("window");

const NFTUploadSuccessScreen = ({ navigation, route }) => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes, darkMode } = useLocalData(
    (state) => state.styles
  );

  // The style Object

  const message = route.params.message;
  const backAction = () => {
    navigation.push("BottomTabBar");
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, [backAction])
  );

  const userId = useProfileData((state) => state.userData.userId);
  const getBundles = useBundlesData((state) => state.getBundles);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {successInfo()}
      </View>
      {backToHomeText()}
    </SafeAreaView>
  );

  function backToHomeText() {
    return (
      <Text
        onPress={() => {
          getBundles(userId);
          navigation.push("BottomTabBar");
        }}
        style={{
          margin: Sizes.fixPadding * 2.0,
          textAlign: "center",
          ...Fonts.primaryColor14Bold,
        }}
      >
        BACK TO HOME
      </Text>
    );
  }

  function successInfo() {
    return (
      <View>
        <Image
          source={
            darkMode
              ? require("../../assets/images/icons/successDarkMode.png")
              : require("../../assets/images/icons/success.jpg")
          }
          style={{
            width: width - 40.0,
            height: height / 3.5,
            resizeMode: "contain",
          }}
        />
        <Text
          style={{
            textAlign: "center",
            marginTop: Sizes.fixPadding * 2.0,
            ...Fonts.whiteColor22SemiBold,
          }}
        >
          Publish Successfully!
        </Text>
        <Text
          style={{
            marginTop: Sizes.fixPadding - 5.0,
            textAlign: "center",
            ...Fonts.grayColor14Regular,
          }}
        >
          {`${message}\nYou can see it in your profile`}
        </Text>
      </View>
    );
  }
};

export default NFTUploadSuccessScreen;
