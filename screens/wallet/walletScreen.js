import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import useProfileData from "../../Data/useProfileData";
import useLocalData from "../../Data/localData/useLocalData";

const { width, height } = Dimensions.get("window");

const ScreenWidth = width < height ? width : height;
const ScreenHeight = height > width ? height : width;

const WalletScreen = ({ navigation }) => {
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
    walletInfoWrapStyle: {
      backgroundColor: Colors.primaryColor,
      justifyContent: "space-between",
      minHeight: 225.0,
      borderRadius: Sizes.fixPadding * 2.0,
      marginHorizontal: Sizes.fixPadding * 2.0,
      marginVertical: Sizes.fixPadding,
      padding: Sizes.fixPadding + 5.0,
    },
    button: {
      marginTop: Sizes.fixPadding,
      marginLeft: Sizes.fixPadding,
      paddingHorizontal: Sizes.fixPadding * 0.5,
      borderColor: Colors.buttonTextColor,
      borderWidth: 1,
      borderRadius: Sizes.fixPadding - 5.0,
      paddingVertical: Sizes.fixPadding - 5.0,
    },
  });

  // Get the user data from the global state
  const { masBalance, busdBalance, usdtBalance, bnbBalance, walletAddress } =
    useProfileData((state) => state.userData);

  // copy the wallet address to clipboard
  const copyToClipboard = useLocalData((state) => state.copyToClipboard);

  // Handle Data
  const [state, setState] = useState({ openDeposit: false });
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const { openDeposit } = state;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
        {walletInfo()}
      </View>
      {openDeposit && Deposit()}
    </SafeAreaView>
  );

  function walletInfo() {
    const iconsArr = [
      {
        name: "MAS",
        icon: require("../../assets/images/coins/mas.png"),
        value: masBalance,
      },
      {
        name: "USDT",
        icon: require("../../assets/images/coins/usdt.png"),
        value: usdtBalance,
      },
      {
        name: "BUSD",
        icon: require("../../assets/images/coins/busd.png"),
        value: busdBalance,
      },
      {
        name: "BNB",
        icon: require("../../assets/images/coins/bnb.png"),
        value: bnbBalance,
      },
    ];
    return (
      <View style={styles.walletInfoWrapStyle}>
        <View>
          <Text
            style={{
              ...Fonts.whiteColor14Medium,
              color: Colors.buttonTextColor,
            }}
          >
            TOTAL BALANCE
          </Text>
          {iconsArr.map((item, index) => (
            <View
              style={{
                flexDirection: "row",
                borderColor: Colors.buttonTextColor,
                borderWidth: 1,
                padding: Sizes.fixPadding,
                alignItems: "center",
                borderRadius: Sizes.fixPadding,
                marginVertical: Sizes.fixPadding * 0.5,
              }}
              key={index}
            >
              <Image
                style={{
                  width: 25,
                  height: 25,
                  marginRight: Sizes.fixPadding * 0.4,
                }}
                source={item.icon}
              />
              <Text
                style={{
                  ...Fonts.whiteColor16Medium,
                  color: Colors.buttonTextColor,
                  marginRight: Sizes.fixPadding * 0.4,
                }}
              >
                {item.name}:
              </Text>
              <Text
                style={{
                  ...Fonts.whiteColor16Medium,
                  color: Colors.buttonTextColor,
                }}
              >
                {item.value.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            paddingTop: Sizes.fixPadding,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              navigation.push("ConnectWallet", { selectNav: "withdraw" })
            }
            style={styles.button}
          >
            <Text
              style={{
                ...Fonts.whiteColor16Medium,
                color: Colors.buttonTextColor,
              }}
            >
              Withdraw
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.push("TransferFunds")}
            style={styles.button}
          >
            <Text
              style={{
                ...Fonts.whiteColor16Medium,
                color: Colors.buttonTextColor,
              }}
            >
              Transfer Funds
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.button}
            onPress={() => updateState({ openDeposit: true })}
          >
            <Text
              style={{
                ...Fonts.whiteColor16Medium,
                color: Colors.buttonTextColor,
              }}
            >
              Deposit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function Deposit() {
    return (
      <View
        style={{
          position: "absolute",
          backgroundColor: "rgba(0,0,0,0.4)",
          width: ScreenWidth,
          height: ScreenHeight,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: Colors.buttonTextColor,
            padding: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding,
            width: ScreenWidth * 0.95,
            alignItems: "center",
          }}
        >
          <Text
            style={{ ...Fonts.primaryColor22SemiBold, textAlign: "center" }}
          >
            Deposit
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: Colors.bodyBackColor,
              lineHeight: 26,
              textAlign: "center",
            }}
          >
            Please make sure that you use BSC (BNB Smart Chain) and send only
            supported tokens (MAS, USDT, BUSD)
          </Text>
          <View
            style={{
              alignItems: "center",
              marginTop: Sizes.fixPadding,
              width: ScreenWidth * 0.7,
            }}
          >
            <Text
              numberOfLines={2}
              style={{
                ...Fonts.whiteColor14Medium,
                color: "#000000",
                textAlign: "center",
              }}
            >
              {walletAddress}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: ScreenWidth * 0.8,
                marginVertical: Sizes.fixPadding
            }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => copyToClipboard(walletAddress)}
              style={{
                backgroundColor: Colors.primaryColor,
                paddingHorizontal: Sizes.fixPadding,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: Sizes.fixPadding * 0.5,
              }}
            >
              <Text
                style={{
                  ...Fonts.whiteColor16Medium,
                  color: Colors.buttonTextColor,
                }}
              >
                Copy Wallet Address
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.primaryColor,
                paddingHorizontal: Sizes.fixPadding,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: Sizes.fixPadding * 0.5,
              }}
              onPress={() => updateState({ openDeposit: false })}
            >
              <Text
                style={{
                  ...Fonts.whiteColor16SemiBold,
                  color: Colors.buttonTextColor,
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
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
          My Wallet
        </Text>
      </View>
    );
  }
};

export default WalletScreen;
