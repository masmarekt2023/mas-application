import {
  Image,
  SafeAreaView,
  StatusBar,
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
import useDonateData from "../../../Data/useDonateData";
import useGetAllUsersData from "../../../Data/useGetAllUsersData";
import useProfileData from "../../../Data/useProfileData";
import useLocalData from "../../../Data/localData/useLocalData";

const DonateScreen = ({ navigation, route }) => {
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
      paddingHorizontal: Sizes.fixPadding * 3.0,
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

  // Get user data from the global state
  const userWallet = useProfileData((state) => state.userData.walletAddress);
  const userName = useProfileData((state) => state.userData.name);

  // transfer coins to database
  const donation = useDonateData((state) => state.donation);

  // Get creat wallet address from the global state
  const creatorsWalletAddress = useGetAllUsersData(
    (state) => state.creatorsWalletAddress
  );

  // handle variables
  const [state, setState] = useState({
    selectedCoin: route.params.selectedCoin.name,
    coinAmount: `1`,
    selectedCoinAmount: route.params.selectedCoin.value,
    message: "",
    walletAddress: route.params?.walletAddress
      ? route.params?.walletAddress
      : "",
    receiverCreator: {
      creatorName: "",
      creatorId: "",
    },
  });
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const {
    selectedCoin,
    selectedCoinAmount,
    coinAmount,
    message,
    walletAddress,
    receiverCreator,
  } = state;

  const coinInputRef = useRef();

  useEffect(() => {
    coinInputRef.current.focus();
  }, []);

  useEffect(() => {
    if (walletAddress.length === 42) {
      const receiverCreator = creatorsWalletAddress.filter(
        (i) => i.walletAddress === walletAddress
      )[0];
      if (receiverCreator) {
        updateState({ receiverCreator: receiverCreator });
      }
    }
  }, [walletAddress]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors.bodyBackColor,
        padding: Sizes.fixPadding,
        flex: 1,
        justifyContent: "space-between",
      }}
    >
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ marginTop: Sizes.fixPadding * 2 }}>
        <Text style={{ textAlign: "center", ...Fonts.whiteColor20Bold }}>
          {route.params?.title}
        </Text>

        <View style={styles.coinInfoWrapStyle}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              +coinAmount > 1
                ? updateState({ coinAmount: `${+coinAmount - 1}` })
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
              +coinAmount < selectedCoinAmount.toFixed()
                ? updateState({ coinAmount: `${+coinAmount + 1}` })
                : null
            }
            style={styles.addRemoveIconWrapStyle}
          >
            <MaterialIcons name="add" color={Colors.whiteColor} size={24.0} />
          </TouchableOpacity>
        </View>

        <View>
          <Text style={{ ...Fonts.whiteColor14SemiBold }}>Creator Name</Text>
          <View
            style={{
              marginTop: Sizes.fixPadding,
              padding: Sizes.fixPadding,
              borderColor: Colors.whiteColor,
              borderWidth: 1,
              opacity: 0.8,
            }}
          >
            <Text style={Fonts.whiteColor14Medium}>
              {receiverCreator.creatorName}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: Sizes.fixPadding * 2 }}>
          <Text style={{ ...Fonts.whiteColor14SemiBold }}>Message</Text>
          <TextInput
            onChangeText={(data) => updateState({ message: data })}
            value={message}
            placeholder="Write Message"
            placeholderTextColor={Colors.grayColor}
            style={{
              ...Fonts.whiteColor14Medium,
              marginTop: Sizes.fixPadding,
              padding: Sizes.fixPadding,
              borderColor: Colors.whiteColor,
              borderWidth: 1,
            }}
            selectionColor={Colors.primaryColor}
          />
        </View>
      </View>
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
          <Text style={{ ...Fonts.grayColor14Regular }}>You will Transfer</Text>
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
          <Text style={{ ...Fonts.grayColor14Regular }}>Transaction fees</Text>
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
            {(+coinAmount * 3) / 100 + +coinAmount} {selectedCoin}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={
            receiverCreator.creatorName === "" ||
            +coinAmount > selectedCoinAmount
          }
          onPress={() =>
            donation(
              token,
              {
                amount: +coinAmount,
                userId: receiverCreator.creatorId,
                coinName: selectedCoin,
                message: message,
              },
              navigation,
              {
                userName: userName,
                userWallet: userWallet,
                coinAmount: coinAmount,
                coinName: selectedCoin,
                creatorName: receiverCreator.creatorName,
                creatorWallet: walletAddress,
              }
            )
          }
          style={{
            ...styles.placeBidButtonStyle,
            opacity:
              receiverCreator.creatorName === "" ||
              +coinAmount > selectedCoinAmount
                ? 0.7
                : 1,
          }}
        >
          <Text
            style={{
              ...Fonts.whiteColor20SemiBold,
              color: Colors.buttonTextColor,
            }}
          >
            Transfer
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DonateScreen;
