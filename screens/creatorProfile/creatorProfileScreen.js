import React, { useLayoutEffect, useState } from "react";
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
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import useGetUser from "../../Data/useGetUser";
import useLoginData from "../../Data/useLoginData";
import Loading from "../../components/Loading";
import Bundle from "../home/Bundle";
import useLocalData from "../../Data/localData/useLocalData";
import OpenLink from "../../components/OpenLink";
import useGetAllUsersData from "../../Data/useGetAllUsersData";
import useChatData from "../../Data/useChatData";

const screenWidth = Dimensions.get("window").width;

const CreatorProfileScreen = ({ navigation }) => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes } = useLocalData((state) => state.styles);

  // The style Object
  const styles = StyleSheet.create({
    backArrowWrapStyle: {
      width: 40.0,
      height: 40.0,
      borderRadius: 20.0,
      backgroundColor: "rgba(255,255,255,0.08)",
      alignItems: "center",
      justifyContent: "center",
      marginTop: Sizes.fixPadding * 2.0,
      marginHorizontal: Sizes.fixPadding * 2.0,
    },
    profileInfoWrapStyle: {
      marginHorizontal: Sizes.fixPadding * 2.0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    followButtonStyle: {
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
    timeLeftAndFavoriteShareIconWrapStyle: {
      marginHorizontal: Sizes.fixPadding,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
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
    timeLeftWrapStyle: {
      alignSelf: "flex-start",
      marginTop: Sizes.fixPadding,
      borderColor: Colors.primaryColor,
      borderWidth: 1.0,
      paddingHorizontal: Sizes.fixPadding,
      borderRadius: Sizes.fixPadding - 5.0,
      paddingVertical: Sizes.fixPadding - 7.0,
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
    headerIconWrapStyle: {
      width: 40.0,
      height: 40.0,
      backgroundColor: Colors.primaryColor,
      borderRadius: Sizes.fixPadding - 2.0,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  // get user data from the Get User Data
  const {
    imageCover,
    userImage,
    userName,
    name,
    description,
    walletAddress,
    subscribers,
    likers,
    supporters,
    bundles,
    creatorId,
    userBundles,
    twitter,
    facebook,
    telegram,
    youtube,
  } = useGetUser((state) => state.userData);
  const isLoading = useGetUser((state) => state.isLoading);

  // get user token from the login data
  const token = useLoginData((state) => state.userInfo.token);

  // Handle subscribe data
  const updateSubscribeData = useGetAllUsersData(
    (state) => state.updateCreatorSubscribeData
  );
  const subscribesUser = useGetAllUsersData((state) => state.subscribesUser);
  const [isSubscribe, setIsSubscribe] = useState(
    subscribesUser.includes(creatorId)
  );
  useLayoutEffect(() => {
    setIsSubscribe(subscribesUser.includes(creatorId));
  }, [subscribesUser]);

  // Handle like data
  const updateLikeData = useGetAllUsersData(
    (state) => state.updateCreatorLikeData
  );
  const likesUser = useGetAllUsersData((state) => state.likesUser);
  const [like, setLike] = useState(likesUser.includes(creatorId));
  useLayoutEffect(() => {
    if (creatorId) {
      setLike(likesUser.includes(creatorId));
    }
  }, [likesUser]);

  // copy the wallet address
  const copyToClipboard = useLocalData((state) => state.copyToClipboard);
  const isCopied = useLocalData((state) => state.isCopied);

  // handle the icons of chat and creat the chat if the creator have not chatting before
  const creatNewChat = useChatData((state) => state.creatNewChat);
  const onClickChat = () => {
    creatNewChat(token, creatorId);
    navigation.push("chat", {
      creatorId: creatorId,
      profilePic: userImage,
      name: name,
      userName: userName,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {creatorProfileInfo()}
        <FlatList
          ListHeaderComponent={
            <>
              {profileDetail()}
              {bundlesInfo()}
            </>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
      {Loading({ isLoading: isLoading })}
    </SafeAreaView>
  );

  function bundlesInfo() {
    const bundlesArr = userBundles.map((i) => ({
      ...i,
      userId: { userName: userName, profilePic: userImage },
    }));
    return bundlesArr.length > 0 ? (
      <View
        style={{
          marginTop: Sizes.fixPadding * 2.0,
          paddingHorizontal: screenWidth * 0.05,
        }}
      >
        <Text
          style={{
            marginBottom: Sizes.fixPadding + 5.0,
            ...Fonts.whiteColor20Bold,
          }}
        >
          Bundles
        </Text>
        <FlatList
          data={bundlesArr}
          keyExtractor={(item) => `${item.id}`}
          renderItem={({ item }) => (
            <Bundle
              item={item}
              style={{ marginBottom: 20, width: screenWidth * 0.9 }}
              navigation={navigation}
            />
          )}
          scrollEnabled={false}
        />
      </View>
    ) : null;
  }

  function profileDetail() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.grayColor14Regular }}>{description}</Text>
        {linkAndSocialMediaInfo()}
        {profileOtherInfo()}
      </View>
    );
  }

  function profileOtherInfo() {
    return (
      <View style={styles.otherInfoWrapStyle}>
        <View style={{ alignItems: "center" }}>
          <Text style={{ ...Fonts.whiteColor16SemiBold }}>
            {subscribers.length}
          </Text>
          <Text style={{ lineHeight: 12.0, ...Fonts.grayColor12Regular }}>
            Subscribes
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ ...Fonts.whiteColor16SemiBold }}>
            {supporters.length}
          </Text>
          <Text style={{ lineHeight: 12.0, ...Fonts.grayColor12Regular }}>
            Supporters
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ ...Fonts.whiteColor16SemiBold }}>{likers.length}</Text>
          <Text style={{ lineHeight: 12.0, ...Fonts.grayColor12Regular }}>
            Likes
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ ...Fonts.whiteColor16SemiBold }}>{bundles}</Text>
          <Text style={{ lineHeight: 12.0, ...Fonts.grayColor12Regular }}>
            Bundles
          </Text>
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
            url={facebook}
            message={"User has not account in Facebook"}
            children={
              <FontAwesome5
                size={15}
                color={facebook === "" ? Colors.whiteColor : Colors.facebook}
                name={"facebook-f"}
              />
            }
          />
          <OpenLink
            url={telegram}
            message={"User has not account in Telegram"}
            children={
              <FontAwesome5
                size={15}
                color={telegram === "" ? Colors.whiteColor : Colors.telegram}
                name={"telegram-plane"}
              />
            }
          />
          <OpenLink
            url={twitter}
            message={"User has not account in Twitter"}
            children={
              <FontAwesome5
                size={15}
                color={twitter === "" ? Colors.whiteColor : Colors.twitter}
                name={"twitter"}
              />
            }
          />
          <OpenLink
            url={youtube}
            message={"User has not account in Youtube"}
            children={
              <FontAwesome5
                size={15}
                color={youtube === "" ? Colors.whiteColor : Colors.youtube}
                name={"youtube"}
              />
            }
          />
        </View>
      </View>
    );
  }

  function creatorProfileInfo() {
    return (
      <View style={{ marginBottom: Sizes.fixPadding * 2.0 }}>
        <ImageBackground
          source={
            imageCover !== ""
              ? { uri: imageCover }
              : require("../../assets/images/icon.png")
          }
          style={{
            width: "100%",
            height: 200.0 + StatusBar.currentHeight,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={styles.backArrowWrapStyle}>
            <MaterialIcons
              name="chevron-left"
              color={Colors.iconColor}
              size={26}
              onPress={() => navigation.pop()}
            />
          </View>
          <View
            style={{
              marginRight: Sizes.fixPadding,
              flexDirection: "row",
              justifyContent: "center",
              marginTop: Sizes.fixPadding * 2.0,
              marginHorizontal: Sizes.fixPadding * 2.0,
            }}
          >
            <TouchableOpacity
              style={{
                ...styles.headerIconWrapStyle,
                marginLeft: Sizes.fixPadding + 5.0,
              }}
              activeOpacity={0.9}
              onPress={onClickChat}
            >
              <Ionicons
                name="chatbubble-outline"
                size={18}
                color={Colors.iconColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                updateLikeData(token, creatorId);
              }}
              style={{
                marginLeft: Sizes.fixPadding + 5.0,
                ...styles.headerIconWrapStyle,
              }}
            >
              <MaterialIcons
                name={like ? "favorite" : "favorite-border"}
                size={18}
                color={like ? Colors.errorColor : Colors.iconColor}
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <View style={styles.profileInfoWrapStyle}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <Image
              source={
                userImage.length
                  ? { uri: userImage }
                  : require("../../assets/images/icon.png")
              }
              style={{ width: 80.0, height: 80.0, borderRadius: 40.0 }}
              resizeMode={"cover"}
            />
            <View style={{ flex: 1, marginLeft: Sizes.fixPadding + 5.0 }}>
              <Text style={{ ...Fonts.whiteColor18SemiBold }}>{name}</Text>
              <Text style={{ lineHeight: 16.0, ...Fonts.whiteColor14Regular }}>
                @{userName}
              </Text>
            </View>
          </View>
          <View style={{ marginTop: Sizes.fixPadding }}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={{
                ...styles.followButtonStyle,
                opacity: isSubscribe ? 0.7 : 1,
              }}
              onPress={() => {
                updateSubscribeData(token, creatorId);
              }}
            >
              <Text
                style={{
                  ...Fonts.whiteColor16SemiBold,
                  color: Colors.buttonTextColor,
                }}
              >
                {isSubscribe ? "Subscribed" : "Subscribe"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              style={{
                ...styles.followButtonStyle,
                marginTop: Sizes.fixPadding,
              }}
              onPress={() =>
                navigation.push("ConnectWallet", {
                  walletAddress: walletAddress,
                  selectNav: "donate",
                  title: "Donate",
                })
              }
            >
              <Text
                style={{
                  ...Fonts.whiteColor16SemiBold,
                  color: Colors.buttonTextColor,
                  textAlign: "center",
                }}
              >
                Donate
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
};
export default CreatorProfileScreen;
