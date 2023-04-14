import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useLayoutEffect, useState } from "react";
import useProfileData from "../../Data/useProfileData";
import useLoginData from "../../Data/useLoginData";
import useGetUser from "../../Data/useGetUser";
import useChatData from "../../Data/useChatData";
import useGetAllUsersData from "../../Data/useGetAllUsersData";
import useLocalData from "../../Data/localData/useLocalData";

const Creator = ({ item, style, navigation }) => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes } = useLocalData((state) => state.styles);

  // The style Object
  const styles = StyleSheet.create({
    cardContainer: {
      marginRight: Sizes.fixPadding * 2.0,
      borderRadius: Sizes.fixPadding * 2,
      backgroundColor: "rgba(255,255,255,0.1)",
      marginBottom: style.marginBottom,
      width: style.width,
      padding: Sizes.fixPadding,
      borderWidth: 1,
      borderColor: Colors.primaryColor,
    },
    timeLeftWrapStyle: {
      alignSelf: "flex-start",
      borderColor: Colors.primaryColor,
      borderWidth: 1.0,
      paddingHorizontal: Sizes.fixPadding - 4,
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
    if (subscribesUser.includes(item._id)) {
      setSubscribed(true);
      setNb(item.followers.filter((i) => i !== userId).length + 1);
    } else {
      setSubscribed(false);
      setNb(item.followers.filter((i) => i !== userId).length);
    }
  }, [subscribesUser]);

  // Handle like data
  const updateLikeData = useGetAllUsersData(
    (state) => state.updateCreatorLikeData
  );
  const likesUser = useGetAllUsersData((state) => state.likesUser);
  const [like, setLike] = useState(item?.likesUsers.includes(userId));

  useEffect(() => {
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
        getUser(token, navigation, item.userName);
      }}
      style={styles.cardContainer}
    >
      <ImageBackground
        source={
          item.profilePic
            ? { uri: item.profilePic }
            : require("../../assets/images/icon.png")
        }
        style={{ height: 160.0 }}
        borderRadius={Sizes.fixPadding}
      ></ImageBackground>
      <View
        style={{
          paddingBottom: Sizes.fixPadding,
        }}
      >
        <View style={{ height: 60, alignItems: 'center' }}>
          <Text numberOfLines={1} style={{ ...Fonts.whiteColor18SemiBold, color: Colors.inputTextColor }}>
            {item.userName}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              lineHeight: 23,
            }}
          >
            <Text style={{...Fonts.primaryColor16Regular, color: Colors.inputTextColor}}>{item.speciality ? 'speciality:' : ''} </Text>
            <Text style={Fonts.grayColor14Regular}>{item.speciality}</Text>
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
            onPress={() => {
              updateSubscribeData(token, item._id);
              setSubscribed((prevState) => !prevState);
            }}
          >
            <Text style={{ ...Fonts.primaryColor12Medium }}>
              {subscribed ? "Subscribed" : "Subscribe"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              setLike((prevState) => !prevState);
              updateLikeData(token, item._id);
            }}
          >
            <MaterialIcons
              name={like ? "favorite" : "favorite-border"}
              size={18}
              color={like ? Colors.errorColor : Colors.primaryColor}
            />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.9} onPress={onClickChat}>
            <Ionicons
              name="chatbubble-outline"
              size={18}
              color={Colors.primaryColor}
            />
          </TouchableOpacity>
          <Text
            style={{
              ...Fonts.primaryColor12Medium,
              display: style?.width < 180 ? "none" : "flex",
            }}
          >
            {nb} {nb > 1 ? "Subs" : "Sub"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Creator;
