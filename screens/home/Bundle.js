import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useLayoutEffect, useState } from "react";
import useLoginData from "../../Data/useLoginData";
import useProfileData from "../../Data/useProfileData";
import useBundlesData from "../../Data/useBundlesData";
import useGetUser from "../../Data/useGetUser";
import useLocalData from "../../Data/localData/useLocalData";

const Bundle = ({ item, style, navigation }) => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes, darkMode } = useLocalData((state) => state.styles);

  // The style Object
  const styles = StyleSheet.create({
    auctionImageStyle: {
      height: 175.0,
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
    titleWrapStyle: {
      marginBottom: Sizes.fixPadding + 5.0,
      marginHorizontal: Sizes.fixPadding * 2.0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    favoriteAndShareIconWrapStyle: {
      alignSelf: "flex-end",
      flexDirection: "row",
      alignItems: "center",
    },
    favoriteAndShareIconContainStyle: {
      zIndex: 3,
      elevation: 3,
      backgroundColor: "rgb(255,255,255)",
      width: 30.0,
      height: 30.0,
      borderRadius: 15.0,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  // get user token from the login data
  const token = useLoginData((state) => state.userInfo.token);

  // get the user id from the user profile data
  const userId = useProfileData((state) => state.userData.userId);

  // Check if the bundle belong to user
  const isUserBundle = item.userId._id === userId;

  // get the list of bundle content from the global state
  const getBundleContentList = useBundlesData(
    (state) => state.getBundleContentList
  );

  // Handle subscribe data
  /*const unSubscribeToBundle = useBundlesData(
    (state) => state.unSubscribeToBundle
  );*/
  const subscribesUser = useBundlesData((state) => state.subscribesUser);
  const [subscribed, setSubscribed] = useState(
    subscribesUser.includes(item._id)
  );
  useLayoutEffect(() => {
    setSubscribed(subscribesUser.includes(item._id));
  }, [subscribesUser]);
  const onSubscribe = () => {
    if (subscribed) {
      //unSubscribeToBundle(token, item._id);
    } else {
      getBundleContentList(token, item._id);
      navigation.push("LiveAuctionsDetail", {
        item: item,
        showPayDialog: true,
      });
    }
  };

  const onEdit = () => {
    navigation.push("EditBundle", { bundleData: item });
  };

  // Handle like data
  const updateLikeData = useBundlesData((state) => state.updateBundlesLikeData);
  const likesUser = useBundlesData((state) => state.likesUser);
  const [like, setLike] = useState(likesUser.includes(item._id));
  useLayoutEffect(() => {
    setLike(likesUser.includes(item._id));
  }, [likesUser]);
  const onClickLike = () => {
    updateLikeData(token, item._id);
  };

  // set the data of the Creator in the global state and navigate to Creator Screen
  const setUsername = useGetUser((state) => state.setUsername);
  const getUser = useGetUser((state) => state.getUser);
  const navToCreatorScreen = () => {
    if (isUserBundle) {
      navigation.navigate("Profile");
    } else {
      setUsername(item.userId.userName);
      getUser(token, navigation, userId);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        getBundleContentList(token, item._id);
        navigation.push("LiveAuctionsDetail", {
          item: item,
          showPayDialog: false,
        });
      }}
      style={{
        marginRight: Sizes.fixPadding * 2.0,
        marginBottom: style.marginBottom,
        borderRadius: Sizes.fixPadding - 5.0,
        width: style.width,
        backgroundColor: "rgba(255,255,255,0.05)",
      }}
    >
      <ImageBackground
        source={{ uri: item.mediaUrl }}
        style={{ ...styles.auctionImageStyle, width: style.width }}
        borderTopLeftRadius={Sizes.fixPadding - 5.0}
        borderTopRightRadius={Sizes.fixPadding - 5.0}
      >
        <View
          style={{
            margin: Sizes.fixPadding,
            ...styles.favoriteAndShareIconWrapStyle,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.favoriteAndShareIconContainStyle}
            onPress={onClickLike}
          >
            <MaterialIcons
              name={like ? "favorite" : "favorite-border"}
              size={18}
              color={like ? Colors.errorColor : Colors.grayColor}
              //onPress={() => updateState({ showSavePopup: true })}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <View
        style={{
          borderWidth: darkMode ? 0 : 1,
          borderColor: Colors.primaryColor,
          borderBottomLeftRadius: Sizes.fixPadding - 3,
          borderBottomRightRadius: Sizes.fixPadding - 3,
        }}
      >
        <View
          style={{
            margin: Sizes.fixPadding,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity activeOpacity={0.9} onPress={navToCreatorScreen}>
            <Image
              source={
                item.userId.profilePic === ""
                  ? require("../../assets/images/icon.png")
                  : { uri: item.userId.profilePic }
              }
              style={{
                width: 40,
                height: 40,
                borderRadius: 27.5,
                marginRight: Sizes.fixPadding,
                display: item.userId.profilePic ? "flex" : "none",
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            style={{ marginLeft: Sizes.fixPadding }}
          >
            <Text style={{ ...Fonts.whiteColor16SemiBold }}>
              {item.bundleTitle}
            </Text>
            <Text
              style={{
                marginTop: Sizes.fixPadding - 10.0,
                lineHeight: 15.0,
                ...Fonts.grayColor14Regular,
              }}
            >
              {new Date(item.createdAt).toLocaleDateString("en-us", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              })}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingHorizontal: Sizes.fixPadding + 5.0,
            paddingVertical: Sizes.fixPadding,
          }}
        >
          <View style={styles.auctionDetailWrapStyle}>
            <Text
              numberOfLines={3}
              style={{
                ...Fonts.grayColor14Regular,
                flex: 1,
                width: 150,
                marginTop: 2,
                height: 30,
                lineHeight: 23,
              }}
            >
              {item.donationAmount} {item.coinName} for {item.duration}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={{
                ...styles.timeLeftWrapStyle,
                opacity: subscribed ? 0.7 : 1,
              }}
              onPress={isUserBundle ? onEdit : onSubscribe}
              disabled={subscribed}
            >
              <Text style={{ ...Fonts.primaryColor12Medium }}>
                {isUserBundle
                  ? "Edit"
                  : subscribed
                  ? "Subscribed"
                  : "Subscribe"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Bundle;
