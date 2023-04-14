import React, { useState, useLayoutEffect } from "react";
import {
  SafeAreaView,
  View,
  Image,
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheet } from "@rneui/themed";
import DashedLine from "react-native-dashed-line";
import useLoginData from "../../Data/useLoginData";
import useBundlesData from "../../Data/useBundlesData";
import moment from "moment";
import useGetUser from "../../Data/useGetUser";
import useProfileData from "../../Data/useProfileData";
import useLocalData from "../../Data/localData/useLocalData";

const { width, height } = Dimensions.get("window");

const LiveAuctionsDetailScreen = ({ navigation, route }) => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes } = useLocalData((state) => state.styles);

  // The style Object

  const styles = StyleSheet.create({
    headerWrapStyle: {
      margin: Sizes.fixPadding * 2.0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerIconWrapStyle: {
      width: 40.0,
      height: 40.0,
      backgroundColor: Colors.tabIconBgColor,
      alignItems: "center",
      justifyContent: "center",
    },
    timeLeftWrapStyle: {
      marginTop: Sizes.fixPadding,
      borderColor: Colors.primaryColor,
      borderWidth: 1.0,
      paddingHorizontal: Sizes.fixPadding,
      borderRadius: Sizes.fixPadding - 5.0,
      paddingVertical: Sizes.fixPadding - 7.0,
    },
    auctionImageStyle: {
      height: height / 3.5,
      borderRadius: Sizes.fixPadding,
      marginHorizontal: Sizes.fixPadding * 2.0,
      width: width - 40.0,
      marginTop: Sizes.fixPadding,
      marginBottom: Sizes.fixPadding + 5.0,
    },
    bidInfoWrapStyle: {
      marginBottom: Sizes.fixPadding * 3.0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    placeBidButtonStyle: {
      backgroundColor: Colors.primaryColor,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: Sizes.fixPadding + 5.0,
      borderRadius: Sizes.fixPadding - 5.0,
      marginVertical: Sizes.fixPadding * 2.0,
    },
    dialogWrapStyle: {
      borderRadius: Sizes.fixPadding - 5.0,
      width: width - 40,
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
    bottomSheetWrapStyle: {
      paddingHorizontal: 20.0,
      paddingTop: Sizes.fixPadding + 5.0,
      borderTopLeftRadius: Sizes.fixPadding * 3.0,
      borderTopRightRadius: Sizes.fixPadding * 3.0,
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
      backgroundColor: "rgba(255,255,255,0.05)",
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
    otherInfoWrapStyle: {
      marginTop: Sizes.fixPadding * 3.0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderColor: Colors.primaryColor,
      borderWidth: 1.0,
      borderRadius: Sizes.fixPadding - 5.0,
      paddingVertical: Sizes.fixPadding + 2.0,
      paddingHorizontal: Sizes.fixPadding + 8.0,
    },
  });

  const item = route.params.item;
  const owner = route.params.item.userId;

  // get user token from the login data
  const token = useLoginData((state) => state.userInfo.token);

  // get the user id from the user profile data
  const userId = useProfileData((state) => state.userData.userId);

  // Get the Bundle Content List from the global state
  const bundleContentList = useBundlesData((state) => state.bundleContentList);

  // Check if the bundle belong to user
  const isUserBundle = owner._id === userId;

  // get Wallet info from the global state
  const { masBalance, usdtBalance, busdBalance } = useProfileData(
    (state) => state.userData
  );
  const currentCoin =
    item.coinName === "MAS"
      ? masBalance
      : item.coinName === "USDT"
      ? usdtBalance
      : busdBalance;

  // Handle Subscribe Data
  /*const unSubscribeToBundle = useBundlesData(
    (state) => state.unSubscribeToBundle
  );*/
  const subscribeToBundle = useBundlesData((state) => state.subscribeToBundle);
  const subscribesUser = useBundlesData((state) => state.subscribesUser);
  const [subscribed, setSubscribed] = useState(
    subscribesUser.includes(item._id)
  );
  useLayoutEffect(() => {
    setSubscribed(subscribesUser.includes(item._id));
  }, [subscribesUser]);
  /*const onUnsubscribe = () => {
    if (subscribed) {
      unSubscribeToBundle(token, item._id);
    }
  };*/
  const onTransfer = () => {
    if (!subscribed) {
      subscribeToBundle(token, item._id);
      setShowDialog(false);
    }
  };

  // Handle Like Data
  const updateLikeData = useBundlesData((state) => state.updateBundlesLikeData);
  const likesUser = useBundlesData((state) => state.likesUser);
  const [like, setLike] = useState(item?.likesUsers.includes(item._id));
  useLayoutEffect(() => {
    setLike(likesUser.includes(item._id));
  }, [likesUser]);
  const onClickLike = () => {
    updateLikeData(token, item._id);
  };

  // set the data of the Creator in the global state and navigate to Creator Screen
  const getUser = useGetUser((state) => state.getUser);
  const navToCreatorScreen = () => {
    if (isUserBundle) {
      navigation.navigate("Profile");
    } else {
      getUser(token, navigation, item.userId.userName);
    }
  };

  const [showDialog, setShowDialog]  = useState(route.params.showPayDialog);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
        {auctionImage()}
        <FlatList
          ListHeaderComponent={
            <>
              {auctionInfo()}
              {bundleOtherInfo()}
              {bundleContentList.length > 0 ? audienceListInfo() : null}
            </>
          }
          showsVerticalScrollIndicator={false}
        />
        {subscribeButton()}
      </View>
      {subscribeBottomSheet()}
    </SafeAreaView>
  );

  function subscribeBottomSheet() {
    return (
      <BottomSheet
        isVisible={showDialog}
        onBackdropPress={() => setShowDialog(false)}
        containerStyle={{ backgroundColor: "rgba(0.5, 0.50, 0, 0.50)" }}
      >
        <View style={styles.bottomSheetWrapStyle}>
          <Text style={{ textAlign: "center", ...Fonts.whiteColor20Bold }}>
            Transfer
          </Text>
          <Text style={{ marginTop: Sizes.fixPadding + 5.0 }}>
            <Text style={{ ...Fonts.grayColor14Regular }}>
              You are about to subscribe for {}
            </Text>
            <Text style={{ ...Fonts.whiteColor14SemiBold }}>
              {item.bundleTitle}
            </Text>
            <Text style={{ ...Fonts.grayColor14Regular }}>
              {} by {}
            </Text>
            <Text style={{ ...Fonts.whiteColor14SemiBold }}>
              @{owner.userName}
            </Text>
          </Text>
          <DashedLine
              dashLength={5}
              dashColor={"rgba(255,255,255,0.2)"}
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
              {currentCoin.toFixed(2)}
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
              {item.donationAmount} {item.coinName}
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
            <Text style={{ ...Fonts.grayColor14Regular }}>Service fees</Text>
            <Text style={{ ...Fonts.whiteColor14SemiBold }}>
              0 {item.coinName}
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
              {item.donationAmount} {item.coinName}
            </Text>
          </View>
          <TouchableOpacity
              activeOpacity={0.9}
              onPress={onTransfer}
              style={{
                ...styles.placeBidButtonStyle,
                opacity: currentCoin < item.donationAmount ? 0.7 : 1,
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
      </BottomSheet>
    );
  }

  function subscribeButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        disabled={subscribed}
        onPress={() => setShowDialog(true)}
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          ...styles.placeBidButtonStyle,
          opacity: subscribed ? 0.7 : 1
        }}
      >
        <Text
          style={{
            ...Fonts.whiteColor20SemiBold,
            color: Colors.buttonTextColor,
          }}
        >
          {subscribed ? "Subscribed" : "Subscribe"}
        </Text>
      </TouchableOpacity>
    );
  }

  function audienceListInfo() {
    const renderItem = ({ item }) => {
      const date = moment(item.createdAt);
      const formatDate = `${date.format("MMM DD,YYYY")} at ${date.format(
        "LT"
      )}`;
      return (
        <View style={styles.bidInfoWrapStyle}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <Image
              source={
                item.mediaUrl
                  ? { uri: item.mediaUrl }
                  : require("../../assets/images/icon.png")
              }
              style={{ width: 70.0, height: 70.0, borderRadius: 35 }}
            />
            <View style={{ flex: 1, marginLeft: Sizes.fixPadding + 5.0 }}>
              <Text style={{ ...Fonts.whiteColor16Medium }}>{item.title}</Text>
              <Text
                style={{
                  ...Fonts.grayColor13Regular,
                  marginTop: -5,
                  marginBottom: 5,
                }}
              >
                {item.details}
              </Text>
              <Text style={{ lineHeight: 15.0, ...Fonts.grayColor13Regular }}>
                {formatDate}
              </Text>
            </View>
          </View>
        </View>
      );
    };
    return (
      <View
        style={{
          marginTop: Sizes.fixPadding * 3.0,
          marginHorizontal: Sizes.fixPadding * 2.0,
        }}
      >
        <Text
          style={{
            marginBottom: Sizes.fixPadding + 5.0,
            ...Fonts.whiteColor20Bold,
          }}
        >
          Audience List
        </Text>
        <FlatList
          data={bundleContentList}
          keyExtractor={(item, index) => `${index}`}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      </View>
    );
  }

  function bundleOtherInfo() {
    const date = moment(item.createdAt);
    return (
      <View
        style={{
          ...styles.otherInfoWrapStyle,
          marginHorizontal: Sizes.fixPadding * 2.0,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text style={{ ...Fonts.whiteColor16SemiBold }}>
            {item.donationAmount}
          </Text>
          <Text style={{ lineHeight: 12.0, ...Fonts.grayColor12Regular }}>
            Amount
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ ...Fonts.whiteColor16SemiBold }}>{item.coinName}</Text>
          <Text style={{ lineHeight: 12.0, ...Fonts.grayColor12Regular }}>
            Coin Name
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ ...Fonts.whiteColor16SemiBold }}>{item.duration}</Text>
          <Text style={{ lineHeight: 12.0, ...Fonts.grayColor12Regular }}>
            Duration
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ ...Fonts.whiteColor16SemiBold }}>
            {date.format("DD MMM YYYY")}
          </Text>
          <Text style={{ lineHeight: 12.0, ...Fonts.grayColor12Regular }}>
            Created Time
          </Text>
        </View>
      </View>
    );
  }

  function auctionImage() {
    return (
      <Image source={{ uri: item.mediaUrl }} style={styles.auctionImageStyle} />
    );
  }

  function auctionInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginTop: Sizes.fixPadding,
        }}
      >
        <View>
          <Text style={{ ...Fonts.whiteColor20Bold }}>{item.bundleTitle}</Text>
          <Text>
            <Text style={Fonts.whiteColor14SemiBold}>Details: </Text>
            <Text style={Fonts.grayColor14Regular}>{item.details}</Text>
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              marginTop: Sizes.fixPadding + 5.0,
            }}
            onPress={navToCreatorScreen}
          >
            <Image
              source={
                owner.profilePic
                  ? { uri: owner.profilePic }
                  : require("../../assets/images/icon.png")
              }
              style={{ width: 55.0, height: 55.0, borderRadius: 27.5 }}
            />
            <View style={{ flex: 1, marginLeft: Sizes.fixPadding + 5.0 }}>
              <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                {owner.userName}
              </Text>
              <Text style={{ lineHeight: 15.0, ...Fonts.grayColor14Regular }}>
                Owner
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function header() {
    return (
      <View style={styles.headerWrapStyle}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <View style={{ borderRadius: 20.0, ...styles.headerIconWrapStyle }}>
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
              flex: 1,
              marginRight: Sizes.fixPadding,
              marginLeft: Sizes.fixPadding + 10.0,
              ...Fonts.whiteColor22Bold,
            }}
          >
            {item.bundleTitle}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onClickLike}
            style={{
              marginLeft: Sizes.fixPadding + 5.0,
              ...styles.headerIconWrapStyle,
              borderRadius: Sizes.fixPadding - 2.0,
            }}
          >
            <MaterialIcons
              name={like ? "favorite" : "favorite-border"}
              size={18}
              color={like ? Colors.errorColor : Colors.whiteColor}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

export default LiveAuctionsDetailScreen;
