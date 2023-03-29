import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useLayoutEffect, useState } from "react";
import useProfileData from "../../Data/useProfileData";
import useLoginData from "../../Data/useLoginData";
import useGetUser from "../../Data/useGetUser";
import useChatData from "../../Data/useChatData";
import useGetAllUsersData from "../../Data/useGetAllUsersData";
import useLocalData from "../../Data/localData/useLocalData";

const screenWidth = Dimensions.get("window").width;

const Creator = ({ item, style, navigation }) => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes, darkMode } = useLocalData((state) => state.styles);

  // The style Object
  const styles = StyleSheet.create({
    auctionImageStyle: {
      height: 140.0,
      borderTopLeftRadius: Sizes.fixPadding - 5.0,
      borderTopRightRadius: Sizes.fixPadding - 5.0,
    },
    auctionDetailWrapStyle: {
      marginTop: Sizes.fixPadding,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    timeLeftWrapStyle: {
      alignSelf: "flex-start",
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

  // set the data of the Creator in the global state
  const setUsername = useGetUser((state) => state.setUsername);
  const getUser = useGetUser((state) => state.getUser);

  // Handle subscribe data
  const updateSubscribeData = useGetAllUsersData(
    (state) => state.updateCreatorSubscribeData
  );
  const subscribesUser = useGetAllUsersData((state) => state.subscribesUser);
  const [subscribed, setSubscribed] = useState(
    subscribesUser.includes(item._id)
  );
  const [nb, setNb] = useState(
    item.followers.filter((i) => i !== userId).length
  );
  useLayoutEffect(() => {
    setSubscribed(subscribesUser.includes(item._id));
    subscribesUser.includes(item._id)
      ? setNb(item.followers.filter((i) => i !== userId).length + 1)
      : setNb(item.followers.filter((i) => i !== userId).length);
  }, [subscribesUser]);

  // Handle like data
  const updateLikeData = useGetAllUsersData(
    (state) => state.updateCreatorLikeData
  );
  const likesUser = useGetAllUsersData((state) => state.likesUser);
  const [like, setLike] = useState(likesUser.includes(item._id));

  useLayoutEffect(() => {
    setLike(likesUser.includes(item._id));
  }, [likesUser]);

  // handle the icons of chat and creat the chat if the creator have not chatting before
  const creatNewChat = useChatData((state) => state.creatNewChat);
  const onClickChat = () => {
    creatNewChat(token, item._id);
    navigation.push("chat", {
      creatorId: item._id,
      profilePic: item.profilePic,
      name: item.name,
      userName: item.userName,
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        setUsername(item.userName);
        getUser(token, navigation, userId);
      }}
      style={{
        marginRight: Sizes.fixPadding * 2.0,
        borderRadius: Sizes.fixPadding - 5.0,
        backgroundColor: "rgba(255,255,255,0.05)",
        marginBottom: style.marginBottom,
        width: screenWidth / 2.2,
        borderWidth: darkMode ? 0 : 1,
        borderColor: Colors.primaryColor
      }}
    >
      <ImageBackground
        source={
          item.profilePic
            ? { uri: item.profilePic }
            : require("../../assets/images/icon.png")
        }
        style={{ ...styles.auctionImageStyle }}
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
            style={{
              ...styles.favoriteAndShareIconContainStyle,
              marginRight: Sizes.fixPadding,
            }}
            onPress={() => {
              updateLikeData(token, item._id);
            }}
          >
            <MaterialIcons
              name={like ? "favorite" : "favorite-border"}
              size={18}
              color={like ? Colors.errorColor : Colors.grayColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.favoriteAndShareIconContainStyle}
            activeOpacity={0.9}
            onPress={onClickChat}
          >
            <Ionicons
              name="chatbubble-outline"
              size={18}
              color={Colors.grayColor}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <View
        style={{
          paddingHorizontal: Sizes.fixPadding + 5.0,
          paddingVertical: Sizes.fixPadding,
        }}
      >
        <Text
          numberOfLines={1}
          style={{ ...Fonts.whiteColor18SemiBold, width: screenWidth / 2.7 }}
        >
          {item.name ? item.name : item.userName}
        </Text>
        <Text
          numberOfLines={3}
          style={{
            ...Fonts.grayColor14Regular,
            flex: 1,
            width: 150,
            marginTop: 2,
            height: 50,
            lineHeight: 23,
          }}
        >
          {item.speciality}
        </Text>
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
            onPress={() => {
              updateSubscribeData(token, item._id);
            }}
          >
            <Text style={{ ...Fonts.primaryColor12Medium }}>
              {subscribed ? "Subscribed" : "Subscribe"}
            </Text>
          </TouchableOpacity>
          <Text style={{ ...Fonts.primaryColor12Medium }}>
            {nb} {nb > 1 ? "Subs" : "Sub"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Creator;
