import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DashedLine from "react-native-dashed-line";
import React, { useEffect, useRef, useState } from "react";
import useLoginData from "../../../Data/useLoginData";
import useWithdrawData from "../../../Data/useWithdrawData";
import useLocalData from "../../../Data/localData/useLocalData";

const ScreenWidth = Dimensions.get("screen").width;
const ScreenHeight = Dimensions.get("screen").height;

import { showMessage } from "react-native-flash-message";

const WithdrawScreen = ({ navigation, route }) => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes } = useLocalData((state) => state.styles);

  // The style Object
  const styles = StyleSheet.create({
    coinsContainerStyle: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginTop: Sizes.fixPadding * 2,
    },
    placeBidButtonStyle: {
      backgroundColor: Colors.primaryColor,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: Sizes.fixPadding + 5.0,
      borderRadius: Sizes.fixPadding - 5.0,
      marginVertical: Sizes.fixPadding * 2.0,
    },
    bottomSheetWrapStyle: {
      paddingHorizontal: 20.0,
      paddingTop: Sizes.fixPadding + 5.0,
      borderTopLeftRadius: Sizes.fixPadding * 3.0,
      borderTopRightRadius: Sizes.fixPadding * 3.0,
      backgroundColor: Colors.bodyBackColor,
    },
    addRemoveIconWrapStyle: {
      borderColor: Colors.whiteColor,
      borderWidth: 1.0,
      width: 35.0,
      height: 35.0,
      borderRadius: 17.5,
      alignItems: "center",
      justifyContent: "center",
    },
    coinInfoWrapStyle: {
      marginVertical: Sizes.fixPadding * 2.0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: Colors.inputBgColor,
      borderRadius: Sizes.fixPadding - 5.0,
      paddingVertical: Sizes.fixPadding + 3.0,
      paddingHorizontal: Sizes.fixPadding * 2.0,
    },
    checkBoxStyle: {
      width: 18.0,
      height: 18.0,
      borderRadius: Sizes.fixPadding - 7.0,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1.0,
    },
  });

  // Get token from login data
  const token = useLoginData((state) => state.userInfo.token);

  const withdraw = useWithdrawData((state) => state.withdraw);

  // Withdraw fees
  const withdrawFess = 0.15;

  // handle variables
  const [state, setState] = useState({
    selectedCoin: route.params.selectedCoin.name,
    coinAmount: "1",
    selectedCoinAmount: route.params.selectedCoin.value,
    walletAddress: "",
    openWarning: true,
  });
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const {
    selectedCoin,
    selectedCoinAmount,
    coinAmount,
    walletAddress,
    openWarning,
  } = state;

  const coinInputRef = useRef();

  useEffect(() => {
    coinInputRef.current.focus();
  }, []);

  return (
    <View
      style={{
        backgroundColor: Colors.bodyBackColor,
        padding: Sizes.fixPadding,
        flex: 1,
        justifyContent: "space-between",
        position: "relative",
      }}
    >
      <ScrollView style={{ flex: 1, marginTop: Sizes.fixPadding * 2 }}>
        <Text style={{ textAlign: "center", ...Fonts.whiteColor20Bold }}>
          Withdraw
        </Text>

        <View style={styles.coinInfoWrapStyle}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              +coinAmount > 1
                ? updateState({ coinAmount: `${Number(coinAmount) - 1}` })
                : null
            }
            style={styles.addRemoveIconWrapStyle}
          >
            <MaterialIcons
              name="remove"
              color={Colors.whiteColor}
              size={24.0}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={route.params.selectedCoin.icon}
              style={{
                width: 20.0,
                height: 30.0,
                resizeMode: "contain",
              }}
            />
            <View
              style={{
                borderWidth: 2,
                borderColor: Colors.primaryColor,
                padding: Sizes.fixPadding,
                borderRadius: Sizes.fixPadding * 0.5,
                marginHorizontal: Sizes.fixPadding,
              }}
            >
              <TextInput
                onChangeText={(data) => updateState({ coinAmount: data })}
                ref={coinInputRef}
                value={coinAmount}
                style={{
                  ...Fonts.primaryColor22SemiBold,
                }}
                selectionColor={Colors.primaryColor}
                keyboardType={"number-pad"}
              />
            </View>
            <Text
              style={{
                ...Fonts.whiteColor16SemiBold,
                marginLeft: Sizes.fixPadding * 0.5,
              }}
            >
              {selectedCoin}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              +coinAmount + withdrawFess <= selectedCoinAmount.toFixed()
                ? updateState({ coinAmount: `${+coinAmount + 1}` })
                : null
            }
            style={styles.addRemoveIconWrapStyle}
          >
            <MaterialIcons name="add" color={Colors.whiteColor} size={24.0} />
          </TouchableOpacity>
        </View>

        <View>
          <Text style={{ ...Fonts.whiteColor14SemiBold }}>Wallet Address</Text>
          <TextInput
            onChangeText={(data) => updateState({ walletAddress: data })}
            value={walletAddress}
            placeholder="Enter Wallet Address"
            placeholderTextColor={Colors.grayColor}
            style={{
              ...Fonts.whiteColor14Medium,
              marginTop: Sizes.fixPadding,
              padding: Sizes.fixPadding,
              borderColor: Colors.whiteColor,
              borderWidth: 2,
            }}
            selectionColor={Colors.primaryColor}
          />
        </View>
        <Text style={{marginTop: Sizes.fixPadding, color: Colors.whiteColor}}>
          Please make sure your wallet address is correct and it is work in{" "}
          <Text style={{color: Colors.errorColor}}>bnb smart chain (BEP20)</Text> Network
        </Text>
      </ScrollView>
      <View>
        <DashedLine
          dashLength={5}
          dashColor={Colors.inputBgColor}
          dashGap={5}
          style={{ marginVertical: Sizes.fixPadding * 2.0 }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ ...Fonts.grayColor14Regular }}>Your Total Coins</Text>
          <Text style={{ ...Fonts.whiteColor14SemiBold }}>
            {selectedCoinAmount.toFixed(2)} {selectedCoin}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ ...Fonts.grayColor14Regular }}>You will pay</Text>
          <Text style={{ ...Fonts.whiteColor14SemiBold }}>
            {Number(coinAmount).toFixed(2)} {selectedCoin}
          </Text>
        </View>
        <View
          style={{
            marginVertical: Sizes.fixPadding - 6.0,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ ...Fonts.grayColor14Regular }}>Withdraw fees</Text>
          <Text style={{ ...Fonts.whiteColor14SemiBold }}>
            {((+coinAmount * 3) / 100).toFixed(2)} {selectedCoin}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ ...Fonts.grayColor14Regular }}>Total payment</Text>
          <Text style={{ ...Fonts.primaryColor14SemiBold }}>
            {(+coinAmount + (+coinAmount * 3) / 100).toFixed(2)} {selectedCoin}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={coinAmount > selectedCoinAmount || coinAmount <= 0}
          onPress={() => walletAddress.length > 0 ?
            withdraw(
              token,
              {
                recipientAddress: walletAddress,
                withdrawAmount: +coinAmount + withdrawFess,
                coin: selectedCoin,
              },
              navigation,
                {
                    amount: coinAmount,
                    coinName: selectedCoin,
                    network: "BEP20",
                    address: walletAddress,
                    feed: `${((+coinAmount * 3) / 100)}`
                }
            ) : showMessage({
                  message: "wallet address should not be empty",
                  type: "warning",
                  titleStyle: {fontWeight: 'bold', fontSize: 16}
              })
          }
          style={{
            ...styles.placeBidButtonStyle,
            opacity: (coinAmount > selectedCoinAmount || coinAmount <= 0) ? 0.7 : 1,
          }}
        >
          <Text
            style={{
              ...Fonts.whiteColor20SemiBold,
              color: Colors.buttonTextColor,
            }}
          >
            Withdraw
          </Text>
        </TouchableOpacity>
      </View>
      {openWarning && WarningMessage()}
    </View>
  );

  function WarningMessage() {
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
            backgroundColor: "#ffffff",
            padding: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding,
            minHeight: ScreenHeight * 0.3,
            width: ScreenWidth * 0.8,
          }}
        >
          <Text
            style={{ ...Fonts.primaryColor22SemiBold, textAlign: "center" }}
          >
            Warning
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: Colors.errorColor,
              lineHeight: 26,
              textAlign: "center",
            }}
          >
            Please make sure you use BSC (BNB Smart Chain) and send only
            supperted tokens (MAS, USDT, BUSD)
          </Text>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: Colors.primaryColor,
                paddingVertical: Sizes.fixPadding * 0.5,
                width: 75,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: Sizes.fixPadding,
              }}
              onPress={() => updateState({ openWarning: false })}
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
};

export default WithdrawScreen;
