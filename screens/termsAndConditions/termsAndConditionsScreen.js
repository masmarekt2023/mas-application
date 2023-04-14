import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import useLocalData from "../../Data/localData/useLocalData";

const TermsAndConditionsScreen = ({ navigation }) => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes } = useLocalData((state) => state.styles);

  const styles = StyleSheet.create({
    backArrowWrapStyle: {
      width: 40.0,
      height: 40.0,
      borderRadius: 20.0,
      backgroundColor: Colors.tabIconBgColor,
      alignItems: "center",
      justifyContent: "center",
    },
  });
  const termsArr = [
    {
      header: "User Conduct",
      text: "Users must agree to use the app in a lawful and ethical manner, and not engage in any activities that may harm the app or other users.",
    },
    {
      header: "Intellectual Property",
      text: "Users must agree to respect the intellectual property rights of others and not use the app to infringe upon those rights.",
    },
    {
      header: "Privacy",
      text: "The app must adhere to all applicable privacy laws and regulations, and clearly outline its data collection and usage practices.",
    },
    {
      header: "Content Guidelines",
      text: "The app must outline guidelines for the types of content that are allowed on the platform and any prohibited content, such as content that is illegal or offensive.",
    },
    {
      header: "Dispute Resolution",
      text: "The app must provide a mechanism for resolving disputes between users, such as through mediation or arbitration.",
    },
    {
      header: "Security",
      text: "The app must implement strong security measures to protect user funds and private keys, such as multi-factor authentication and encryption.",
    },
    {
      header: "User Responsibility",
      text: "Users must agree to take responsibility for their own wallet security, such as keeping their private keys confidential and taking precautions against theft or loss.",
    },
    {
      header: "Backup and Recovery",
      text: "The app must provide users with the ability to backup and recover their wallet in the event of loss or damage.",
    },
    {
      header: "Transaction Fees",
      text: "The app may charge transaction fees for sending and receiving cryptocurrencies or NFTs, which must be clearly outlined in the terms and conditions.",
    },
    {
      header: "Legal Compliance",
      text: "The app must comply with all applicable laws and regulations related to cryptocurrency and financial services.",
    },
    {
      header: "Limited Liability",
      text: "The app developer may limit its liability for any losses or damages related to the use of the wallet feature.",
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: Sizes.fixPadding }}
        >
          <View
            style={{
              padding: Sizes.fixPadding,
            }}
          >
            {termsArr.map((e, i) => term(i, e.header, e.text))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );

  function term(key, header, text) {
    return (
      <Text
        style={{ lineHeight: 20, marginBottom: Sizes.fixPadding }}
        key={key}
      >
        <Text style={Fonts.primaryColor16SemiBold}>{header}: </Text>
        <Text
          style={{ ...Fonts.whiteColor14Medium, color: Colors.inputTextColor }}
        >
          {text}
        </Text>
      </Text>
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
          Terms & Conditions
        </Text>
      </View>
    );
  }
};

export default TermsAndConditionsScreen;
