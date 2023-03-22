import React from "react";
import {
  SafeAreaView,
  View,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  FlatList,
} from "react-native";
import useCreatorsData from "../../Data/useCreatorsData";
import Creator from "./Creator";
import Bundle from "./Bundle";
import useBundlesData from "../../Data/useBundlesData";
import useGetAllUsersData from "../../Data/useGetAllUsersData";
import useGetUser from "../../Data/useGetUser";
import useLoginData from "../../Data/useLoginData";
import useNotificationData from "../../Data/useNotificationData";
import { MaterialIcons } from "@expo/vector-icons";
import useProfileData from "../../Data/useProfileData";
import useLocalData from "../../Data/localData/useLocalData";

const { width } = Dimensions.get("window");

const itemWidth = Math.round(width * 0.8);

const HomeScreen = ({ navigation }) => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes } = useLocalData((state) => state.styles);

  // The style Object
  const styles = StyleSheet.create({
    notificationIconWrapStyle: {
      position: "relative",
      width: 40.0,
      height: 40.0,
      borderRadius: Sizes.fixPadding,
      alignItems: "center",
      justifyContent: "center",
    },
    userImageStyle: {
      width: 50.0,
      height: 50.0,
      borderRadius: 25.0,
      borderColor: Colors.primaryColor,
      borderWidth: 1.5,
    },
    userInfoWrapStyle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      margin: Sizes.fixPadding * 2.0,
    },
    bannerImageStyle: {
      width: itemWidth,
      height: 150,
      alignItems: "center",
      justifyContent: "flex-end",
    },
    bannerCategoryWrapStyle: {
      backgroundColor: Colors.primaryColor,
      paddingHorizontal: Sizes.fixPadding * 2.8,
      paddingVertical: Sizes.fixPadding - 5.0,
      borderRadius: Sizes.fixPadding - 5.0,
      marginBottom: Sizes.fixPadding,
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
    timeLeftAndFavoriteShareIconWrapStyle: {
      marginHorizontal: Sizes.fixPadding,
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
    createNewButtonWrapStyle: {
      backgroundColor: Colors.primaryColor,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: Sizes.fixPadding - 5.0,
      paddingVertical: Sizes.fixPadding + 5.0,
      marginVertical: Sizes.fixPadding,
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
    favoriteAndShareIconContainStyle: {
      zIndex: 3,
      elevation: 3,
      backgroundColor: "rgb(255,255,255,0.7)",
      width: 30.0,
      height: 30.0,
      borderRadius: 15.0,
      alignItems: "center",
      justifyContent: "center",
    },
    animatedView: {
      backgroundColor: "#333333",
      position: "absolute",
      bottom: 0,
      alignSelf: "center",
      borderRadius: Sizes.fixPadding * 2.0,
      paddingHorizontal: Sizes.fixPadding + 5.0,
      paddingVertical: Sizes.fixPadding,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  // get user token from the login data
  const token = useLoginData((state) => state.userInfo.token);
  // get user data from the global state
  const { userImage, userName } = useProfileData((state) => state.userData);
  // Creators list
  const creatorsList = useCreatorsData((state) => state.creatorsList);
  // All Creators List
  const allCreatorsList = useGetAllUsersData((state) => state.allUsersList);
  // Bundle list
  const bundlesList = useBundlesData((state) => state.bundlesList).slice(0, 10);
  // Get Creators Info
  const getCreators = useGetUser((state) => state.getUser);
  const setCreatorName = useGetUser((state) => state.setUsername);
  // get if there are unread messages
  const isUnreadMessage = useNotificationData((state) => state.isUnreadMessage);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {userInfo()}
        <FlatList
          ListHeaderComponent={
            <>
              {StoriesInfo()}
              {Creators()}
              {topCreatorInfo()}
              {Bundles()}
            </>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );

  function StoriesInfo() {
    const topCreators = [
      {
        userName: userName,
        profilePic: userImage,
      },
      ...allCreatorsList.map((item) => ({
        userName: item.userName,
        profilePic: item.profilePic,
      })),
    ];
    const renderItem = ({ item }) => {
      return (
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            marginRight: Sizes.fixPadding * 2.0,
            alignItems: "center",
            borderRadius: 30,
            backgroundColor: "#fff",
            padding: 2,
            borderColor: Colors.primaryColor,
            borderWidth: 2,
          }}
        >
          <Image
            source={
              item.profilePic
                ? { uri: item.profilePic }
                : require("../../assets/images/icon.png")
            }
            style={{ width: 55.0, height: 55.0, borderRadius: 27.5 }}
          />
        </TouchableOpacity>
      );
    };
    return (
      <View>
        <FlatList
          data={topCreators}
          keyExtractor={(item, index) => `${index}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: Sizes.fixPadding * 2.0 }}
        />
      </View>
    );
  }

  function topCreatorInfo() {
    const topCreators = allCreatorsList
      .sort((p1, p2) =>
        p1.followers.length < p2.followers.length
          ? 1
          : p1.followers.length > p2.followers.length
          ? -1
          : 0
      )
      .slice(0, 5);

    const renderItem = ({ item }) => {
      const onPress = () => {
        setCreatorName(item.userName);
        getCreators(token, navigation, item._id);
      };

      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPress}
          style={{
            marginRight: Sizes.fixPadding * 2.0,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            source={
              item.profilePic
                ? { uri: item.profilePic }
                : require("../../assets/images/icon.png")
            }
            style={{ width: 55.0, height: 55.0, borderRadius: 27.5 }}
          />
          <View style={{ marginLeft: Sizes.fixPadding + 5.0 }}>
            <Text style={{ ...Fonts.whiteColor16SemiBold }}>
              @{item.userName}
            </Text>
            <Text
              style={{
                marginTop: Sizes.fixPadding - 7.0,
                lineHeight: 15.0,
                ...Fonts.grayColor14Regular,
              }}
            >
              Subscriber: {item.followers.length}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };
    return (
      <View style={{ marginTop: Sizes.fixPadding * 3.0 }}>
        <View style={styles.titleWrapStyle}>
          <Text style={{ ...Fonts.whiteColor20Bold }}>Top Creator</Text>
        </View>
        <FlatList
          data={topCreators}
          keyExtractor={(item) => `${item._id}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: Sizes.fixPadding * 2.0 }}
        />
      </View>
    );
  }

  function Creators() {
    const renderItem = ({ item }) => (
      <Creator
        item={item}
        style={{ marginBottom: 0 }}
        navigation={navigation}
      />
    );
    return (
      <View style={{ marginTop: Sizes.fixPadding }}>
        <View style={styles.titleWrapStyle}>
          <Text style={{ ...Fonts.whiteColor20Bold }}>Creators</Text>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.push("AllCreators")}
          >
            <Text style={{ ...Fonts.primaryColor16SemiBold }}>See all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={creatorsList}
          keyExtractor={(item) => `${item._id}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: Sizes.fixPadding * 2.0 }}
        />
      </View>
    );
  }

  function Bundles() {
    const renderItem = ({ item }) => (
      <Bundle
        item={item}
        style={{ marginBottom: 0, width: width / 2.2 }}
        navigation={navigation}
      />
    );
    return (
      <View style={{ marginTop: Sizes.fixPadding * 3.0 }}>
        <View style={styles.titleWrapStyle}>
          <Text style={{ ...Fonts.whiteColor20Bold }}>Bundles</Text>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.push("AllBundles")}
          >
            <Text style={{ ...Fonts.primaryColor16SemiBold }}>See all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={bundlesList}
          keyExtractor={(item) => `${item._id}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: Sizes.fixPadding * 2.0 }}
        />
      </View>
    );
  }

  function userInfo() {
    return (
      <View style={styles.userInfoWrapStyle}>
        <Text style={{ ...Fonts.whiteColor20Bold, fontStyle: "italic" }}>
          MAS Marketplace
        </Text>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("Notification")}
          style={{
            ...styles.notificationIconWrapStyle,
            backgroundColor: isUnreadMessage
              ? Colors.tabIconBgColor
              : Colors.primaryColor,
          }}
        >
          {isUnreadMessage ? (
            <View
              style={{
                position: "absolute",
                top: -Sizes.fixPadding * 0.5,
                right: -Sizes.fixPadding * 0.5,
                borderRadius: Sizes.fixPadding * 0.5,
                width: Sizes.fixPadding,
                height: Sizes.fixPadding,
                backgroundColor: Colors.primaryColor,
              }}
            ></View>
          ) : null}
          <MaterialIcons
            name="notifications"
            size={24}
            color={
              isUnreadMessage ? Colors.primaryColor : Colors.buttonTextColor
            }
          />
        </TouchableOpacity>
      </View>
    );
  }
};

export default HomeScreen;
