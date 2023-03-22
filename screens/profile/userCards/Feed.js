import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import useLoginData from "../../../Data/useLoginData";
import useProfileData from "../../../Data/useProfileData";
import useLikeData from "../../../Data/useLikeData";
import useGetAllUsersData from "../../../Data/useGetAllUsersData";
import useGetUser from "../../../Data/useGetUser";
import useLocalData from "../../../Data/localData/useLocalData";

const Feed = ({ item, style, navigation }) => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes, darkMode } = useLocalData((state) => state.styles);

  // The style Object
  const styles = StyleSheet.create({
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

  // get creators Data from global state
  const creator = useGetAllUsersData((state) => state.allUsersList).filter(
    (i) => i._id === item.userId
  )[0];
  const creatorPic = creator?.profilePic;

  // set the creator data in global state and show it in creator screen
  const setCreatorName = useGetUser((state) => state.setUsername);
  const getCreator = useGetUser((state) => state.getUser);

  // handle variables
  const [like, setLike] = useState(item.likesUsers.includes(userId));

  // fetch the status of like data
  const updateLikeData = useLikeData((state) => state.updateFeedLikeData);
  const onClickLike = () => {
    updateLikeData(token, item._id);
    setLike((state) => !state);
  };

  return (
    <View
      activeOpacity={0.9}
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
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              setCreatorName(creator.userName);
              getCreator(token, navigation, userId);
            }}
          >
            <Image
              source={{ uri: creatorPic }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 27.5,
                marginRight: Sizes.fixPadding,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            style={{ marginLeft: Sizes.fixPadding }}
          >
            <Text style={{ ...Fonts.whiteColor16SemiBold }}>{item.title}</Text>
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
              {item.details}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Feed;
