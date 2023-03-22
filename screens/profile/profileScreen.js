import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Image,
  StyleSheet,
  Text,
} from "react-native";
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import useProfileData from "../../Data/useProfileData";
import MyBundles from "./TopBarSections/MyBundles";
import MySubscription from "./TopBarSections/MySubscription";
import MyFeed from "./TopBarSections/MyFeed";
import MySubscribers from "./TopBarSections/MySubscribers";
import DonateTransaction from "./TopBarSections/DonateTransaction";
import useLocalData from "../../Data/localData/useLocalData";
import TransactionHistory from "./TopBarSections/TransactionHistory";
import OpenLink from "../../components/OpenLink";

const screenWidth = Dimensions.get("window").width;

const ProfileScreen = ({ navigation }) => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes } = useLocalData((state) => state.styles);

  // The style Object
  const styles = StyleSheet.create({
    backArrowWrapStyle: {
      width: 40.0,
      height: 40.0,
      borderRadius: 20.0,
      backgroundColor: "rgba(255,255,255,0.2)",
      alignItems: "center",
      justifyContent: "center",
    },
    profileInfoWrapStyle: {
      marginHorizontal: Sizes.fixPadding * 2.0,
      marginTop: -Sizes.fixPadding,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    editButtonStyle: {
      backgroundColor: Colors.primaryColor,
      borderRadius: Sizes.fixPadding - 5.0,
      paddingHorizontal: Sizes.fixPadding * 2.0,
      paddingVertical: Sizes.fixPadding - 5.0,
    },
    linkWrapStyle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      borderColor: Colors.grayColor,
      borderWidth: 1.0,
      borderRadius: Sizes.fixPadding * 3.0,
      paddingHorizontal: Sizes.fixPadding + 10.0,
      paddingVertical: Sizes.fixPadding - 2.0,
      maxWidth: screenWidth / 1.8,
    },
    linkAndSocialMediaInfoWrapStyle: {
      marginTop: Sizes.fixPadding * 2.0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    favoriteAndShareIconContainStyle: {
      backgroundColor: "rgba(255,255,255,0.07)",
      width: 30.0,
      height: 30.0,
      borderRadius: Sizes.fixPadding - 2.0,
      alignItems: "center",
      justifyContent: "center",
    },
    favoriteAndShareIconWrapStyle: {
      alignSelf: "flex-end",
      flexDirection: "row",
      alignItems: "center",
    },
    auctionImageStyle: {
      height: 200.0,
      borderTopLeftRadius: Sizes.fixPadding - 5.0,
      borderTopRightRadius: Sizes.fixPadding - 5.0,
    },
    auctionDetailWrapStyle: {
      marginTop: Sizes.fixPadding - 18.0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    bottomSheetWrapStyle: {
      paddingHorizontal: 20.0,
      paddingTop: Sizes.fixPadding + 5.0,
      paddingBottom: Sizes.fixPadding * 2.0,
      borderTopLeftRadius: Sizes.fixPadding * 3.0,
      borderTopRightRadius: Sizes.fixPadding * 3.0,
      backgroundColor: Colors.bodyBackColor,
    },
    dialogWrapStyle: {
      borderRadius: Sizes.fixPadding - 5.0,
      width: screenWidth - 40,
      padding: 0.0,
    },
    collectionNameFieldStyle: {
      backgroundColor: "rgba(255,255,255,0.05)",
      paddingHorizontal: Sizes.fixPadding,
      paddingVertical: Sizes.fixPadding + 5.0,
      borderRadius: Sizes.fixPadding - 5.0,
      ...Fonts.grayColor12Regular,
      marginTop: Sizes.fixPadding + 5.0,
      marginBottom: Sizes.fixPadding * 3.0,
    },
    createCollectionButtonStyle: {
      borderRadius: Sizes.fixPadding - 5.0,
      paddingVertical: Sizes.fixPadding + 5.0,
      backgroundColor: Colors.primaryColor,
      alignItems: "center",
      justifyContent: "center",
    },
    dialogContentWrapStyle: {
      paddingTop: Sizes.fixPadding + 5.0,
      paddingBottom: Sizes.fixPadding * 3.0,
      paddingHorizontal: Sizes.fixPadding * 2.0,
      backgroundColor: Colors.bodyBackColor,
    },
    createNewButtonWrapStyle: {
      backgroundColor: Colors.primaryColor,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: Sizes.fixPadding - 5.0,
      paddingVertical: Sizes.fixPadding + 5.0,
      marginVertical: Sizes.fixPadding,
    },
    headerWrapStyle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: Sizes.fixPadding * 2.0,
      marginHorizontal: Sizes.fixPadding * 2.0,
    },
    tabOptionWrapStyle: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: Sizes.fixPadding - 3.0,
      paddingHorizontal: Sizes.fixPadding + 5.0,
      marginRight: Sizes.fixPadding * 2.0,
    },
    tabBarWrapStyle: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.05)",
      borderRadius: Sizes.fixPadding - 5.0,
      padding: Sizes.fixPadding - 5.0,
      marginHorizontal: Sizes.fixPadding,
      marginTop: Sizes.fixPadding,
      marginBottom: Sizes.fixPadding * 2.0,
    },
    collectionsInfoWrapStyle: {
      flex: 1,
      marginHorizontal: Sizes.fixPadding,
      maxWidth: screenWidth / 2.5,
      marginBottom: Sizes.fixPadding,
    },
    activityInfoWrapStyle: {
      marginHorizontal: Sizes.fixPadding * 2.0,
      marginBottom: Sizes.fixPadding * 2.0,
      flexDirection: "row",
      alignItems: "center",
    },
    animatedView: {
      backgroundColor: "#fff",
      position: "absolute",
      bottom: 50,
      alignSelf: "center",
      borderRadius: Sizes.fixPadding * 2.0,
      paddingHorizontal: Sizes.fixPadding + 5.0,
      paddingVertical: Sizes.fixPadding,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  const topBarList = [
    {
      option: "My Bundles",
      index: 0,
      section: <MyBundles navigation={navigation} />,
    },
    {
      option: "My Subscription",
      index: 1,
      section: <MySubscription navigation={navigation} />,
    },
    {
      option: "My Feed",
      index: 2,
      section: <MyFeed navigation={navigation} />,
    },
    {
      option: "Subscribers",
      index: 3,
      section: <MySubscribers navigation={navigation} />,
    },
    {
      option: "Donate Transaction",
      index: 4,
      section: <DonateTransaction navigation={navigation} />,
    },
    {
      option: "Transaction History",
      index: 5,
      section: <TransactionHistory navigation={navigation} />,
    },
  ];

  const viewArr = [
    "Total Balance",
    "Total Earnings",
    "My Activities",
    "About Me",
  ];

  const {
    imageCover,
    userImage,
    userName,
    description,
    masBalance,
    walletAddress,
    busdBalance,
    usdtBalance,
    bnbBalance,
    name,
    telegram,
    facebook,
    youtube,
    twitter,
  } = useProfileData((state) => state.userData);

  // Get total earnings from the global state
  const totalEarnings = useProfileData((state) => state.totalEarnings);

  // handle variables
  const [state, setState] = useState({
    selectedTabIndex: 0,
    selectedSection: topBarList[0].section,
    selectedView: viewArr[0],
  });
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const { selectedTabIndex, selectedSection, selectedView } = state;

  // copy wallet address to Clipboard
  const copyToClipboard = useLocalData((state) => state.copyToClipboard);
  const isCopied = useLocalData((state) => state.isCopied);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {profileInfo()}
        {viewSelector()}
        <FlatList
          ListHeaderComponent={
            <>
              {selectedView === viewArr[0] && totalEarningsInfo()}
              {selectedView === viewArr[1] && totalEarningsInfo()}
              {selectedView === viewArr[2] && (
                <>
                  {tabBar()}
                  {selectedSection}
                </>
              )}
              {selectedView === viewArr[3] && profileDetail()}
            </>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );

  function viewSelector() {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: Sizes.fixPadding,
        }}
      >
        {viewArr.map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.9}
            onPress={() => updateState({ selectedView: item })}
            style={{
              flex: 1,
              borderBottomWidth: selectedView === item ? 2 : 0,
              borderColor: Colors.primaryColor,
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: 2,
            }}
          >
            <Text
              style={{
                ...Fonts.whiteColor14SemiBold,
                fontSize: 13,
                color:
                  selectedView === item
                    ? Colors.primaryColor
                    : Colors.whiteColor,
              }}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  function tabBar() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          updateState({
            selectedTabIndex: item.index,
            selectedSection: item.section,
          })
        }
        style={{
          backgroundColor:
            selectedTabIndex === item.index
              ? Colors.inputBgColor
              : "transparent",
          ...styles.tabOptionWrapStyle,
        }}
      >
        <Text style={{ ...Fonts.whiteColor16SemiBold }}>{item.option}</Text>
      </TouchableOpacity>
    );
    return (
      <View style={styles.tabBarWrapStyle}>
        <FlatList
          data={topBarList}
          keyExtractor={(item) => `${item.index}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }

  function profileDetail() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        {description !== "" && (
          <Text style={{ ...Fonts.grayColor14Regular }}>{description}</Text>
        )}
        {linkAndSocialMediaInfo()}
      </View>
    );
  }

  function totalEarningsInfo() {
    const iconsArr = [
      {
        name: "MAS",
        desc: "MAS",
        icon: require("../../assets/images/coins/mas.png"),
        value:
          selectedView === viewArr[0] ? masBalance : totalEarnings.masBalance,
      },
      {
        name: "TetherUs",
        desc: "USDT",
        icon: require("../../assets/images/coins/usdt.png"),
        value:
          selectedView === viewArr[0] ? usdtBalance : totalEarnings.usdtBalance,
      },
      {
        name: "BUSD",
        desc: "BUSD",
        icon: require("../../assets/images/coins/busd.png"),
        value:
          selectedView === viewArr[0] ? busdBalance : totalEarnings.busdBalance,
      },
      {
        name: "BNB",
        desc: "BNB",
        icon: require("../../assets/images/coins/bnb.png"),
        value:
          selectedView === viewArr[0] ? bnbBalance : totalEarnings.bnbBalance,
      },
    ];
    const renderItem = ({ item, index }) => (
      <View
        key={index}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: index !== iconsArr.length - 1 ? Sizes.fixPadding : 0,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={item.icon} style={{ width: 30, height: 30 }} />
          <View style={{ marginLeft: Sizes.fixPadding * 1.5 }}>
            <Text style={Fonts.whiteColor16SemiBold}>{item.name}</Text>
            <Text
              style={{
                ...Fonts.grayColor14Regular,
                marginTop: -Sizes.fixPadding / 2,
              }}
            >
              {item.desc}
            </Text>
          </View>
        </View>
        <Text style={Fonts.whiteColor16Regular}>{item.value.toFixed(2)}</Text>
      </View>
    );

    return (
      <View
        style={{
          marginTop: Sizes.fixPadding,
          paddingHorizontal: Sizes.fixPadding,
        }}
      >
        <Text style={Fonts.whiteColor16SemiBold}>
          {selectedView === viewArr[0]
            ? "TOTAL BALANCE"
            : "Total Creat & Earnings"}
        </Text>
        <View
          style={{
            marginVertical: Sizes.fixPadding,
            borderColor: Colors.primaryColor,
            borderWidth: 1,
            borderRadius: Sizes.fixPadding - 5.0,
            padding: Sizes.fixPadding,
          }}
        >
          {iconsArr.map((item, index) =>
            renderItem({ item: item, index: index })
          )}
        </View>
      </View>
    );
  }

  function linkAndSocialMediaInfo() {
    return (
      <View style={styles.linkAndSocialMediaInfoWrapStyle}>
        <View style={styles.linkWrapStyle}>
          <Text numberOfLines={1} style={{ ...Fonts.grayColor14Regular }}>
            {walletAddress}
          </Text>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => copyToClipboard(walletAddress)}
          >
            <MaterialCommunityIcons
              name={isCopied ? "check" : "content-copy"}
              size={18}
              color={Colors.primaryColor}
              style={{ marginLeft: Sizes.fixPadding }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: screenWidth * 0.3,
            justifyContent: "space-around",
          }}
        >
          <OpenLink
            url={facebook ? facebook : ""}
            message={"User has not account in Facebook"}
            children={
              <FontAwesome5
                size={15}
                color={
                  facebook === "" || !facebook
                    ? Colors.whiteColor
                    : Colors.facebook
                }
                name={"facebook-f"}
              />
            }
          />
          <OpenLink
            url={telegram ? telegram : ""}
            message={"User has not account in Telegram"}
            children={
              <FontAwesome5
                size={15}
                color={
                  telegram === "" || !telegram
                    ? Colors.whiteColor
                    : Colors.telegram
                }
                name={"telegram-plane"}
              />
            }
          />
          <OpenLink
            url={twitter ? twitter : ""}
            message={"User has not account in Twitter"}
            children={
              <FontAwesome5
                size={15}
                color={
                  twitter === "" || !twitter
                    ? Colors.whiteColor
                    : Colors.twitter
                }
                name={"twitter"}
              />
            }
          />
          <OpenLink
            url={youtube ? youtube : ""}
            message={"User has not account in Youtube"}
            children={
              <FontAwesome5
                size={15}
                color={
                  youtube === "" || !youtube
                    ? Colors.whiteColor
                    : Colors.youtube
                }
                name={"youtube"}
              />
            }
          />
        </View>
      </View>
    );
  }

  function profileInfo() {
    return (
      <View style={{ marginBottom: Sizes.fixPadding * 2.0 }}>
        <ImageBackground
          source={
            imageCover === ""
              ? require("../../assets/images/icon.png")
              : { uri: imageCover }
          }
          style={{ width: "100%", height: 200.0 + StatusBar.currentHeight }}
        >
          <View style={styles.headerWrapStyle}>
            <Text
              style={{
                ...Fonts.whiteColor20Bold,
                color: Colors.buttonTextColor,
              }}
            >
              Profile
            </Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push("Setting")}
                style={{ ...styles.backArrowWrapStyle }}
              >
                <Ionicons
                  name="settings-outline"
                  color={Colors.buttonTextColor}
                  size={20}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
        <View style={styles.profileInfoWrapStyle}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <Image
              source={
                userImage === ""
                  ? require("../../assets/images/icon.png")
                  : { uri: userImage }
              }
              style={{ width: 80.0, height: 80.0, borderRadius: 40.0 }}
            />
            <View
              style={{
                flex: 1,
                marginLeft: Sizes.fixPadding + 5.0,
                marginTop: Sizes.fixPadding,
              }}
            >
              <Text style={{ ...Fonts.whiteColor18SemiBold }}>{name}</Text>
              <Text style={{ lineHeight: 16.0, ...Fonts.whiteColor14Regular }}>
                @{userName}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.push("Wallet")}
            style={{
              ...styles.editButtonStyle,
              marginTop: Sizes.fixPadding,
              marginLeft: Sizes.fixPadding,
              paddingHorizontal: Sizes.fixPadding * 0.5,
            }}
          >
            <Text
              style={{
                ...Fonts.whiteColor16Medium,
                color: Colors.buttonTextColor,
              }}
            >
              My Wallet
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

export default ProfileScreen;
