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
import useProfileData from "../../../Data/useProfileData";
import useLoginData from "../../../Data/useLoginData";

const { width, height } = Dimensions.get("window");

const WalletSuccessScreen = ({ navigation, route }) => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes, darkMode } = useLocalData(
    (state) => state.styles
  );

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
    certDate,
  } = route.params;

  const token = useLoginData((state) => state.userInfo.token);
  const getProfile = useProfileData((state) => state.getProfile);
  const getTransactionHistoryList = useProfileData(
    (state) => state.getTransactionHistoryList
  );
  const getDonationTransactionList = useProfileData(
    (state) => state.getDonationTransactionList
  );
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Title</title>
  </head>
  <body>
    <div style="height: 95vh; font-family: sans-serif">
      <div
        style="
          height: 7%;
          margin-left: auto;
          margin-right: auto;
          background-color: #581726;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          gap: 15px;
          font-family: sans-serif;
          color: white;
        "
      >
        <img
          src="https://www.masplatform.net/images/icon.png"
          style="width: 50px"
        />
        <h3>C E R T I F I C A T E O F D O N A T I O N</h3>
        <img
          src="https://www.masplatform.net/images/icon.png"
          style="width: 50px"
        />
      </div>
      <div
        style="
          height: 40%;
          width: 95%;
          margin: 40px auto;
          padding: 15px;
          border: 1px black solid;
          border-radius: 10px;
        "
      >
        <div style="display: flex; align-items: center; width: 100%; gap: 10px;">
          <h3 style="font-size: 16px;">Sender Name:</h3>
          <p style="font-weight: 800; font-size: 20px;">${userName}</p>
        </div>
        <div style="display: flex; align-items: center; width: 100%; gap: 10px">
          <h3 style="font-size: 16px;">Sender Wallet Address':</h3>
          <p style="font-weight: 800; font-size: 20px;">${userWallet}</p>
        </div>
        <div style="display: flex; align-items: center; width: 100%; gap: 10px">
          <h3 style="font-size: 16px;">Amount:</h3>
          <p style="font-weight: 800; font-size: 20px;">${coinAmount} ${coinName}</p>
        </div>
        <div style="display: flex; align-items: center; width: 100%; gap: 10px">
          <h3 style="font-size: 16px;">Receiver Name:</h3>
          <p style="font-weight: 800; font-size: 20px;">${creatorName}</p>
        </div>
        <div style="display: flex; align-items: center; width: 100%; gap: 10px">
          <h3 style="font-size: 16px;">Receiver Wallet Address':</h3>
          <p style="font-weight: 800; font-size: 20px;">${creatorWallet}</p>
        </div>
        <div style="display: flex; align-items: center; width: 100%; gap: 10px">
          <h3 style="font-size: 16px;">Date: </h3>
          <p style="font-weight: 800; font-size: 20px;">${certDate}</p>
        </div>
      </div>
      <div style="display: flex; align-items: center; width: 100%; gap: 10px; justify-content: center;">
          <h3 style="font-size: 16px;">Certificate Id: </h3>
          <p style="font-size: 16px;">${certificateID}</p>
      </div>
      <div style="color: red; width: 100%; text-align: center;"><span
            style="font-size: large; color: black;">Note: </span>This certificate is published one time and can't be
        accessed again
    </div>
    </div>
  </body>
</html>
`;

  const printToFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

  /*const downloadFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri, {
      UTI: "public.item",
      mimeType: "application/pdf",
    });
  };*/

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
        onPress={() => {
          getProfile(token);
          getTransactionHistoryList(token);
          getDonationTransactionList(token);
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
            color: Colors.primaryColor,
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
