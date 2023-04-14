import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
  Dimensions,
  StyleSheet,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import useLocalData from "../../../Data/localData/useLocalData";
import React, { useCallback } from "react";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";
import useLoginData from "../../../Data/useLoginData";
import useProfileData from "../../../Data/useProfileData";

const { width, height } = Dimensions.get("screen");

const screenWidth = width < height ? width : height;

const WithdrawSuccessScreen = ({ navigation, route }) => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes } = useLocalData((state) => state.styles);

  // The style Object
  const styles = StyleSheet.create({
    info: {
      ...Fonts.grayColor14Regular,
      color: Colors.primaryColor,
      fontWeight: "700",
      fontSize: 16,
      textAlign: "right",
    },
    infoContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: Sizes.fixPadding,
    },
  });

  const { amount, address, txid, coinName, network, feed } = route.params;

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

  const token = useLoginData((state) => state.userInfo.token);
  const getProfile = useProfileData((state) => state.getProfile);
  const getTransactionHistoryList = useProfileData(
    (state) => state.getTransactionHistoryList
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View
        style={{ flex: 1, alignItems: "center", marginTop: screenWidth * 0.1 }}
      >
        {header()}
        <View
          style={{
            width: screenWidth,
            borderBottomWidth: 1,
            borderColor: Colors.inputBgColor,
            marginVertical: Sizes.fixPadding * 2,
          }}
        />
        {WithdrawInfo()}
        <TouchableOpacity
          activeOpacity={0.9}
          style={{ position: "absolute", bottom: Sizes.fixPadding * 3 }}
          onPress={() => {
            getProfile(token);
            getTransactionHistoryList(token);
            navigation.push("BottomTabBar");
          }}
        >
          <Text style={Fonts.primaryColor16SemiBold}>Back To Home Page</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  function header() {
    return (
      <View
        style={{
          alignItems: "center",
        }}
      >
        <Text style={{ ...Fonts.grayColor12Medium, fontSize: 20 }}>Amount</Text>
        <Text style={Fonts.whiteColor20Bold}>
          <Text style={{ fontSize: 35 }}>{amount}</Text> {coinName}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AntDesign name="checkcircle" size={24} color={Colors.greenColor} />
          <Text
            style={{
              ...Fonts.greenColor14Medium,
              fontWeight: "bold",
              fontSize: 18,
              marginLeft: Sizes.fixPadding,
            }}
          >
            Completed
          </Text>
        </View>
        <Text
          style={{ marginTop: Sizes.fixPadding, ...Fonts.grayColor14Regular }}
        >
          You have successfully withdraw {amount} {coinName}
        </Text>
      </View>
    );
  }

  function WithdrawInfo() {
    const date = moment();
    return (
      <View
        style={{
          paddingVertical: Sizes.fixPadding * 2,
          width: screenWidth,
          paddingHorizontal: Sizes.fixPadding * 2,
        }}
      >
        <View style={styles.infoContainer}>
          <Text style={styles.info}>Network</Text>
          <Text
            style={{
              ...Fonts.whiteColor16Medium,
              color: Colors.inputTextColor,
            }}
          >
            {network}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.info}>Address</Text>
          <Text
            style={{
              ...Fonts.whiteColor16Medium,
              color: Colors.inputTextColor,
              width: screenWidth * 0.5,
              textAlign: "right",
            }}
            numberOfLines={2}
          >
            {address}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.info}>Txid</Text>
          <Text
            style={{
              ...Fonts.whiteColor16Medium,
              color: Colors.inputTextColor,
            }}
          >
            {txid}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.info}>Network fee</Text>
          <Text
            style={{
              ...Fonts.whiteColor16Medium,
              color: Colors.inputTextColor,
            }}
          >
            {feed} {coinName}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.info}>Date</Text>
          <Text
            style={{
              ...Fonts.whiteColor16Medium,
              color: Colors.inputTextColor,
            }}
          >
            {date.format("YYYY-MM-DD HH:mm:ss")}
          </Text>
        </View>
      </View>
    );
  }
};
export default WithdrawSuccessScreen;
