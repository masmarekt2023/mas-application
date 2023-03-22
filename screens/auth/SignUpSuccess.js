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

const { width, height } = Dimensions.get("window");

const SignUpSuccess = ({ navigation }) => {
  // Get Colors from the Global state
    const { Colors, Fonts, Sizes, darkMode } = useLocalData((state) => state.styles);

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
        onPress={() => navigation.push("Login")}
        style={{
          margin: Sizes.fixPadding * 2.0,
          textAlign: "center",
          ...Fonts.primaryColor14Bold,
        }}
      >
        BACK TO LOGIN
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
          Created Successfully!
        </Text>
        <Text
          style={{
            marginTop: Sizes.fixPadding - 5.0,
            textAlign: "center",
            ...Fonts.grayColor14Regular,
          }}
        >
          {`You have successfully Created your account`}
        </Text>
      </View>
    );
  }
};

export default SignUpSuccess;
