import React, { useLayoutEffect } from "react";
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
  ImageBackground,
} from "react-native";
import useCreatorsData from "../../Data/useCreatorsData";
import Creator from "./Creator";
import Bundle from "./Bundle";
import useBundlesData from "../../Data/useBundlesData";
import useGetAllUsersData from "../../Data/useGetAllUsersData";
import useGetUser from "../../Data/useGetUser";
import useLoginData from "../../Data/useLoginData";
import useNotificationData from "../../Data/useNotificationData";
import {
  MaterialIcons,
  AntDesign,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import useProfileData from "../../Data/useProfileData";
import useLocalData from "../../Data/localData/useLocalData";
import useStoryData from "../../Data/useStoryData";
import * as ImagePicker from "expo-image-picker";
import { useForm } from "react-hook-form";
import { BottomSheet } from "@rneui/themed";
import Carousel from "react-native-snap-carousel-v4";
import useBannerData from "../../Data/useBannerData";

const { width, height } = Dimensions.get("window");

const widthScreen = width < height ? width : height;
const heightScreen = height > width ? height : width;

const convertToFileType = (uri, name) => {
  if (uri !== "") {
    const type = uri.split(".")[uri.split(".").length - 1];
    return {
      name: `${name}.${type}`,
      uri: uri,
      type: `application/${type}`,
    };
  } else {
    return { uri: "" };
  }
};

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
    userInfoWrapStyle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      margin: Sizes.fixPadding,
      marginBottom: 0,
    },
    titleWrapStyle: {
      marginBottom: Sizes.fixPadding + 5.0,
      marginHorizontal: Sizes.fixPadding * 2.0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
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
      width: widthScreen - 40,
      padding: 0.0,
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
    storyContainerStyle: {
      alignItems: "center",
      width: 50,
      height: 50,
      borderRadius: 25.0,
      backgroundColor: "#fff",
      justifyContent: "center",
      position: "relative",
    },
    addStoryStyle: {
      position: "absolute",
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: Colors.primaryColor,
      justifyContent: "center",
      alignItems: "center",
      right: 0,
      bottom: 0,
    },
    changeProfilePicBottomSheetStyle: {
      backgroundColor: Colors.bodyBackColor,
      paddingHorizontal: Sizes.fixPadding * 2.0,
      paddingTop: Sizes.fixPadding + 10.0,
      borderTopLeftRadius: Sizes.fixPadding * 3.0,
      borderTopRightRadius: Sizes.fixPadding * 3.0,
    },
    changeProfilePicOptionsIconWrapStyle: {
      width: 40.0,
      height: 40.0,
      borderRadius: 20.0,
      alignItems: "center",
      justifyContent: "center",
    },
    sendButtonStyle: {
      width: 35,
      height: 35,
      borderRadius: 17.5,
      backgroundColor: Colors.primaryColor,
      justifyContent: "center",
      alignItems: "center",
    },
    bannerImageStyle: {
      width: Math.round(widthScreen * 0.8),
      height: 190,
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
  });

  // get user token from the login data
  const token = useLoginData((state) => state.userInfo.token);
  // Get user profile data
  const { userId, userImage, name, userName } = useProfileData(
    (state) => state.userData
  );
  // Banner List
  const bannerList = useBannerData((state) => state.bannerList);
  const bannerDuration = useBannerData((state) => state.bannerDuration);
  // Creators list
  const creatorsList = useCreatorsData((state) => state.creatorsList);
  // Top Creators
  const topCreators = useGetAllUsersData((state) => state.topUser);
  // Bundle list
  const bundlesList = useBundlesData((state) => state.bundlesList);
  // Get Creators Info
  const getCreators = useGetUser((state) => state.getUser);
  // get if there are unread messages
  const isUnreadMessage = useNotificationData((state) => state.isUnreadMessage);
  // get the story from the user
  const storyArr = useStoryData((state) => state.storyArr);
  const userStories = useStoryData((state) => state.userStories);
  // get the subscription creators
  const subscriptionCreators = useProfileData(
    (state) => state.subscriptionCreators
  );
  // upload story
  const uploadStory = useStoryData((state) => state.addStory);

  // React-Hook-form for handling the form's inputs
  const { setValue, watch } = useForm({
    defaultValues: {
      file: convertToFileType(userImage, `${name}-profilePic`),
      showBottomSheet: false,
      openFileSender: false,
      isCameraOpen: false,
    },
  });

  // Select File From device
  const selectFile = async () => {
    try {
      setValue("showBottomSheet", false);
      let res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
      });
      const type = res.uri.split(".")[res.uri.split(".").length - 1];
      uploadStory(
        token,
        {
          name: `${res.type}.${type}`,
          uri: res.uri,
          type: `application/${type}`,
        },
        userId
      );
      setValue("file", { uri: "" });
      //setValue("openFileSender", true);
    } catch (err) {
      console.log("Error in upload file : addScreen.js");
    }
  };

  // Access to camera and handle the photo
  const cameraPicUrl = useLocalData((state) => state.cameraPicUrl);
  const takePic = () => {
    setValue("showBottomSheet", false);
    setValue("cameraOpen", true);
    navigation.push("LocalCamera");
  };

  useLayoutEffect(() => {
    if (cameraPicUrl !== "" && watch("cameraOpen")) {
      //setValue("file", convertToFileType(cameraPicUrl, "camera"));
      uploadStory(token, convertToFileType(cameraPicUrl, "camera"), userId);
      setValue("file", { uri: "" });
      setValue("cameraOpen", false);
      //setValue("openFileSender", true);
    }
  }, [cameraPicUrl]);

  // View user stories
  const viewStory = () => {
    setValue("showBottomSheet", false);
    navigation.push("Story", {
      item: userStories,
      isUserStory: true,
      userInfo: { userName: userName, userImage: userImage },
    });
  };

  // upload story
  const addStory = () => {
    uploadStory(token, watch("file"), userId);
    setValue("file", { uri: "" });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {userInfo()}
        <View
          style={{
            width: width,
            height: 1,
            backgroundColor: Colors.primaryColor,
          }}
        ></View>
        <FlatList
          ListHeaderComponent={
            <>
              {StoriesInfo()}
              {banners()}
              {Creators()}
              {topCreatorInfo()}
              {Bundles()}
            </>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
      {changeProfilePicOptionsSheet()}
      {watch("openFileSender") && FileSender()}
    </SafeAreaView>
  );

  function banners() {
    const renderItem = ({ item }) => (
      <ImageBackground
        source={{uri: item.media}}
        style={styles.bannerImageStyle}
        resizeMode="cover"
        borderRadius={Sizes.fixPadding - 5.0}
      />
    );
    return (
      <View style={{ marginVertical: Sizes.fixPadding * 2 }}>
        <Carousel
          data={bannerList}
          sliderWidth={widthScreen}
          itemWidth={Math.round(widthScreen * 0.8)}
          renderItem={renderItem}
          autoplay={true}
          autoplayInterval={bannerDuration * 1000}
          inactiveSlideShift={0}
        />
      </View>
    );
  }

  function StoriesInfo() {
    const renderItem = ({ item }) => {
      const isUser = item.userId === userId;
      const userDetails = isUser
        ? { profilePic: userImage, userName: "Your Story" }
        : subscriptionCreators.find((i) => i._id === item.userId);
      return (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            isUser
              ? setValue("showBottomSheet", true)
              : navigation.push("Story", {
                  item: item.result,
                  isUserStory: isUser,
                  userInfo: {
                    userImage: userDetails?.profilePic
                      ? userDetails?.profilePic
                      : "",
                    userName: userDetails?.userName,
                  },
                })
          }
          style={{ alignItems: "center", marginRight: Sizes.fixPadding * 2.0 }}
        >
          <View
            style={{
              ...styles.storyContainerStyle,
              borderColor: isUser
                ? userStories?.length
                  ? Colors.primaryColor
                  : "#949494"
                : Colors.primaryColor,
              borderWidth: isUser ? (userStories?.length ? 2 : 1) : 2,
              display:
                item.result?.length > 0 ? "flex" : isUser ? "flex" : "none",
            }}
          >
            <Image
              source={
                userDetails?.profilePic
                  ? { uri: userDetails?.profilePic }
                  : require("../../assets/images/icon.png")
              }
              style={{
                width: 47.0,
                height: 47.0,
                borderRadius: 23.5,
                borderWidth: 1,
                borderColor: Colors.grayColor,
              }}
            />
            <View
              style={{
                ...styles.addStoryStyle,
                display: isUser ? "flex" : "none",
              }}
            >
              <AntDesign name="plus" size={12} color={Colors.buttonTextColor} />
            </View>
          </View>
          <Text style={Fonts.whiteColor14Regular}>{userDetails?.userName}</Text>
        </TouchableOpacity>
      );
    };
    return (
      <View>
        <FlatList
          data={[
            { userId: userId, result: userStories },
            ...storyArr.filter((i) => i.userId !== userId),
          ]}
          keyExtractor={(item, index) => `${index}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingLeft: Sizes.fixPadding * 2.0,
            paddingTop: Sizes.fixPadding,
          }}
        />
      </View>
    );
  }

  function topCreatorInfo() {
    const renderItem = ({ item }) => {
      const onPress = () => {
        item._id === userId
          ? navigation.push("Setting")
          : getCreators(token, navigation, item.userName);
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
          keyExtractor={(item, index) => `${index}`}
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
        style={{ marginBottom: 0, width: 200 }}
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
        style={{ marginBottom: 0, width: 200 }}
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
          keyExtractor={(item, index) => `${index}`}
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
        <Text style={{ ...Fonts.whiteColor22Bold, fontSize: 26 }}>
          MAS Marketplace
        </Text>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("Notification")}
          style={{
            marginRight: Sizes.fixPadding,
          }}
        >
          {isUnreadMessage ? (
            <View
              style={{
                position: "absolute",
                top: -Sizes.fixPadding * 0.5,
                right: -Sizes.fixPadding * 0.5,
                borderRadius: Sizes.fixPadding * 0.5,
              }}
            ></View>
          ) : null}
          <MaterialIcons
            name="notifications"
            size={24}
            color={isUnreadMessage ? Colors.primaryColor : Colors.primaryColor}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function changeProfilePicOptionsSheet() {
    return (
      <BottomSheet
        isVisible={watch("showBottomSheet")}
        containerStyle={{ backgroundColor: "rgba(0.5, 0.50, 0, 0.50)" }}
        onBackdropPress={() => setValue("showBottomSheet", false)}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setValue("showBottomSheet", false)}
          style={styles.changeProfilePicBottomSheetStyle}
        >
          <Text style={{ textAlign: "center", ...Fonts.whiteColor20SemiBold }}>
            Choose Option
          </Text>
          <View
            style={{
              marginTop: Sizes.fixPadding + 10.0,
              marginBottom: Sizes.fixPadding,
            }}
          >
            {changeProfilePicOptionsSort({
              bgColor: "#009688",
              icon: (
                <Entypo
                  name="camera"
                  size={18}
                  color={Colors.buttonTextColor}
                />
              ),
              option: "Camera",
            })}
            {changeProfilePicOptionsSort({
              bgColor: "#00A7F7",
              icon: (
                <MaterialCommunityIcons
                  name="image"
                  size={20}
                  color={Colors.buttonTextColor}
                />
              ),
              option: "Gallery",
            })}
            {userStories?.length > 0 &&
              changeProfilePicOptionsSort({
                bgColor: "#DD5A5A",
                icon: (
                  <AntDesign
                    name="eye"
                    size={20}
                    color={Colors.buttonTextColor}
                  />
                ),
                option: "View Story",
              })}
          </View>
        </TouchableOpacity>
      </BottomSheet>
    );
  }

  function changeProfilePicOptionsSort({ bgColor, icon, option }) {
    const onPress = () => {
      option === "Camera" ? takePic() : null;
      option === "Gallery" ? selectFile() : null;
      option === "View Story" ? viewStory() : null;
    };
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: Sizes.fixPadding * 2.0,
        }}
      >
        <View
          style={{
            ...styles.changeProfilePicOptionsIconWrapStyle,
            backgroundColor: bgColor,
          }}
        >
          {icon}
        </View>
        <Text
          style={{
            marginLeft: Sizes.fixPadding + 5.0,
            ...Fonts.whiteColor14Medium,
          }}
        >
          {option}
        </Text>
      </TouchableOpacity>
    );
  }

  function FileSender() {
    return (
      <View
        style={{
          backgroundColor: Colors.blackColor,
          width: widthScreen,
          height: heightScreen - 80, // 80 px is bottom bar Height
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          style={{ margin: Sizes.fixPadding }}
          onPress={() => setValue("openFileSender", false)}
        >
          <AntDesign name="close" size={24} color={Colors.whiteColor} />
        </TouchableOpacity>
        <Image
          style={{ flex: 1 }}
          source={{ uri: watch("file").uri ? watch("file").uri : "" }}
          resizeMode={"stretch"}
        />
        <View
          style={{
            paddingHorizontal: Sizes.fixPadding,
            paddingTop: Sizes.fixPadding,
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            style={{ ...styles.sendButtonStyle }}
            onPress={addStory}
          >
            <AntDesign name="upload" size={18} color={Colors.buttonTextColor} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

export default HomeScreen;
