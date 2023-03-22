import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  StatusBar,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import useProfileData from "../../../Data/useProfileData";
import useLocalData from "../../../Data/localData/useLocalData";

const { height } = Dimensions.get("window");

const ConnectWalletScreen = ({ navigation, route }) => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes } = useLocalData((state) => state.styles);

  // The style Object
  const styles = StyleSheet.create({
    backArrowWrapStyle: {
      width: 40.0,
      height: 40.0,
      borderRadius: 20.0,
      backgroundColor: Colors.tabIconBgColor,
      alignItems: "center",
      justifyContent: "center",
    },
    walletOptionWrapStyle: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.05)",
      borderRadius: Sizes.fixPadding - 5.0,
      paddingHorizontal: Sizes.fixPadding + 5.0,
      paddingVertical: Sizes.fixPadding,
      marginHorizontal: Sizes.fixPadding * 2.0,
      marginBottom: Sizes.fixPadding * 2.0,
      borderColor: Colors.primaryColor,
    },
    walletImageStyle: {
      width: "100%",
      height: height / 3.0,
      resizeMode: "contain",
      marginBottom: Sizes.fixPadding + 5.0,
    },
    continueButtonStyle: {
      backgroundColor: Colors.primaryColor,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: Sizes.fixPadding - 5.0,
      paddingVertical: Sizes.fixPadding + 5.0,
      margin: Sizes.fixPadding * 2.0,
    },
  });

  // Get the user data from the global state
  const { masBalance, busdBalance, usdtBalance, bnbBalance } = useProfileData(
    (state) => state.userData
  );

  const iconsArr = [
    {
      name: "MAS",
      icon: require("../../../assets/images/coins/mas.png"),
      value: masBalance,
    },
    {
      name: "USDT",
      icon: require("../../../assets/images/coins/usdt.png"),
      value: usdtBalance,
    },
    {
      name: "BUSD",
      icon: require("../../../assets/images/coins/busd.png"),
      value: busdBalance,
    },
    {
      name: "BNB",
      icon: require("../../../assets/images/coins/bnb.png"),
      value: bnbBalance,
    },
  ];

  // Selected Coin
  const [selectedCoin, setSelectedCoin] = useState(iconsArr[0]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView>{walletOptions()}</ScrollView>
      </View>
      {continueButton()}
    </SafeAreaView>
  );

  function continueButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        //onPress={() => navigation.push("PlaceBidSuccess")}
        onPress={() =>
          navigation.push(route.params.selectNav, {
            selectedCoin: selectedCoin,
            walletAddress: route.params?.walletAddress,
            title: route.params.title,
          })
        }
        style={styles.continueButtonStyle}
      >
        <Text
          style={{
            ...Fonts.whiteColor20SemiBold,
            color: Colors.buttonTextColor,
          }}
        >
          Continue
        </Text>
      </TouchableOpacity>
    );
  }

  function walletOptions() {
    return iconsArr.map((item, index) => (
      <TouchableOpacity
        key={index}
        activeOpacity={0.9}
        onPress={() => setSelectedCoin(item)}
        style={{
          ...styles.walletOptionWrapStyle,
          borderWidth: selectedCoin.name === item.name ? 1 : 0,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            source={item.icon}
            style={{ width: 36.0, height: 36.0, resizeMode: "contain" }}
          />
          <Text
            style={{
              marginLeft: Sizes.fixPadding + 5.0,
              ...Fonts.whiteColor18Medium,
            }}
          >
            {item.name}
          </Text>
        </View>
        <Text style={Fonts.whiteColor18Medium}>{item.value.toFixed(2)}</Text>
      </TouchableOpacity>
    ));
  }

  function header() {
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 2.0,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View style={styles.backArrowWrapStyle}>
          <MaterialIcons
            name="chevron-left"
            color={Colors.primaryColor}
            size={26}
            onPress={() => navigation.pop()}
          />
        </View>
        <Text
          numberOfLines={1}
          style={{
            marginLeft: Sizes.fixPadding * 2.0,
            flex: 1,
            ...Fonts.whiteColor22Bold,
          }}
        >
          Choose Coin
        </Text>
      </View>
    );
  }
};

export default ConnectWalletScreen;
