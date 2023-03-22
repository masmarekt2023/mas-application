import React, { useCallback } from "react";
import {
  SafeAreaView,
  View,
  StatusBar,
  Dimensions,
  Image,
  Text,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { FontAwesome5 } from "@expo/vector-icons";
import useLocalData from "../../../Data/localData/useLocalData";

const { width, height } = Dimensions.get("window");

const WalletSuccessScreen = ({ navigation, route }) => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes, darkMode } = useLocalData(
    (state) => state.styles
  );

  // The style Object

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

  const {
    userName,
    userWallet,
    coinAmount,
    coinName,
    creatorName,
    creatorWallet,
    certificateID,
  } = route.params;
  const html = `<!DOCTYPE html>
                    <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <title>Title</title>
                        </head>
                        <body>
                            <div style="height: 100vh">
                                <div style="height: 10%; margin-left: auto; margin-right: auto; background-color: #581726; display: flex; justify-content: center; align-items: center; padding: 20px; gap: 15px; font-family: sans-serif; color: white">
                                    <img src="https://www.masplatform.net/images/icon.png" style="width: 50px">
                                    <h3>C E R T I F I C A T E O F D O N A T I O N</h3>
                                    <img src="https://www.masplatform.net/images/icon.png" style="width: 50px">
                                </div>
                                <div style="height: 60%; display: flex; justify-content: center; align-items: center">
                                    <div style="text-align: center; font-family: sans-serif;">
                                        <p style="color: #000000">This is to certify that</p>
                                        <h3>${userName}</h3>
                                        <p>(${userWallet})</p>
                                        <p>Has donated <span style="font-weight: bold; font-size: 20px;">${coinAmount} ${coinName}</span> to</p>
                                        <h3>${creatorName}</h3>
                                        <p>(${creatorWallet})</p>
                                    </div>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center; font-family: sans-serif; padding: 0 10px 0 10px ">
                                    <div>
                                        <p style="color: #b94945">MAS MANGER<p>
                                        <p style="font-size: 10px; margin-top: 0px; text-align: center">MAS founder & CEO</p>
                                    </div>
                                    <span style="font-size: 12px; color: #ccc">This certificate is published one time and can't be accessed again</span>
                                    <div>
                                        <p style="font-weight: 600">certificate Id:</p>
                                        <p style="font-size: 10px; color: #777; text-align: end">${certificateID}</p>
                                    </div>
                                </div>
                            </div>
                        </body>
                    </html>`;

  const printToFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

  const downloadFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri, {
      UTI: "public.item",
      mimeType: "application/pdf",
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {successInfo()}
        {ShareVerification()}
      </View>
      {backToHomeText()}
    </SafeAreaView>
  );

  function backToHomeText() {
    return (
      <Text
        onPress={() => navigation.push("BottomTabBar")}
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

  function ShareVerification() {
    return (
      <View
        style={{
          marginTop: Sizes.fixPadding,
          paddingHorizontal: Sizes.fixPadding,
        }}
      >
        <Text style={{ ...Fonts.primaryColor22SemiBold, textAlign: "center" }}>
          CERTIFICATE OF DONATION
        </Text>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: Sizes.fixPadding,
          }}
        >
          <TouchableOpacity
            onPress={printToFile}
            style={{
              borderWidth: 1,
              borderColor: Colors.primaryColor,
              padding: Sizes.fixPadding,
              borderRadius: Sizes.fixPadding * 0.5,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <FontAwesome5 name="share" size={24} color={Colors.whiteColor} />
            <Text
              style={{
                ...Fonts.whiteColor16SemiBold,
                marginLeft: Sizes.fixPadding,
              }}
            >
              Share
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            ...Fonts.primaryColor16SemiBold,
            color: Colors.errorColor,
            textAlign: "center",
            marginTop: Sizes.fixPadding,
          }}
        >
          Note: This certificate is published one time and can't be accessed
          again
        </Text>
      </View>
    );
  }

  function successInfo() {
    return (
      <View>
        <Image
          source={
            darkMode
              ? require("../../../assets/images/icons/successDarkMode.png")
              : require("../../../assets/images/icons/success.jpg")
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
            ...Fonts.whiteColor22SemiBold,
          }}
        >
          Success!
        </Text>
        <Text
          style={{
            marginTop: Sizes.fixPadding,
            lineHeight: 28,
            textAlign: "center",
          }}
        >
          <Text
            style={{
              ...Fonts.grayColor14Regular,
              fontSize: 16,
            }}
          >
            You have successfully{" "}
          </Text>
          <Text style={Fonts.whiteColor16SemiBold}>donated 1 MAS</Text>
          <Text
            style={{
              ...Fonts.grayColor14Regular,
              fontSize: 16,
            }}
          >
            {" "}
            to{" "}
          </Text>
          <Text style={Fonts.whiteColor16SemiBold}>Mohammed Radwan</Text>
        </Text>
      </View>
    );
  }
};

export default WalletSuccessScreen;
