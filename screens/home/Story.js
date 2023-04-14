import {
  Animated,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import useLocalData from "../../Data/localData/useLocalData";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import useProfileData from "../../Data/useProfileData";
import useStoryData from "../../Data/useStoryData";
import useLoginData from "../../Data/useLoginData";
import { Dialog } from "@rneui/themed";
import { Video } from "expo-av";

const {width, height} = Dimensions.get("screen")

const screenWidth = width < height ? width : height;
const screenHeight = width > height ? width : height;

const videoFormats = [
  "mp4",
  "mov",
  "wmv",
  "avi",
  "mkv",
  "flv",
  "webm",
  "m4v",
  "mpeg",
  "mpg",
  "m2v",
  "3gp",
];

const Story = ({ navigation, route }) => {
  // Get Colors from the Global state
  const { Colors, Sizes, Fonts } = useLocalData((state) => state.styles);
  // The style Object
  const styles = StyleSheet.create({
    deleteDialogStyle: {
      width: screenWidth * 0.6,
      padding: 0,
      alignItems: "center",
      paddingTop: Sizes.fixPadding * 2,
      borderRadius: 10,
    },
    dialogTextStyle: {
      width: 200,
      textAlign: "center",
      color: '#000000',
      lineHeight: 20,
      marginBottom: Sizes.fixPadding * 3,
    },
    deleteButtonStyle: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: "#eee",
      width: screenWidth * 0.6,
      alignItems: "center",
      paddingVertical: Sizes.fixPadding,
    },
  });

  const storyArr = route.params.item;
  const isUserStory = route.params.isUserStory;
  const { userName, userImage } = route.params.userInfo;
  const width = screenWidth - Sizes.fixPadding * 2 - storyArr.length * 2;
  const token = useLoginData((state) => state.userInfo.token);
  const { userId } = useProfileData((state) => state.userData);
  const userLikedStories = useStoryData((state) => state.userLikedStories);
  const likeDislikeStory = useStoryData((state) => state.likeDislikeStory);
  const deleteStory = useStoryData((state) => state.deleteStory);

  const videoRef = React.useRef(null);

  const [state, setState] = useState({
    item: storyArr[0],
    index: 0,
    showDeleteDialog: false,
    playVideo: false,
    videoDuration: 0,
  });

  const updateState = (data) => setState({ ...state, ...data });

  const { item, index, showDeleteDialog, videoDuration } = state;

  const mediaType = videoFormats.includes(item.type.split("/")[1])
    ? "video"
    : "image";

  // Stop the video when the deleteDialog in open and start it when it closed
  useEffect(() => {
    if (mediaType === "video") {
      if (showDeleteDialog) {
        videoRef.current.setPositionAsync(0);
        videoRef.current.pauseAsync();
      } else {
        videoRef.current.playAsync();
      }
    }
  }, [mediaType, showDeleteDialog]);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        if (index < storyArr.length - 1) {
          updateState({ index: index + 1, item: storyArr[index + 1] });
        } else {
          navigation.navigate("BottomTabBar");
        }
      },
      mediaType === "video" && videoDuration > 0 ? videoDuration : 5000
    );
    if (showDeleteDialog) {
      clearTimeout(timer);
    }
    return () => clearTimeout(timer);
  }, [index, showDeleteDialog, videoDuration]);

  const animation = storyArr.map(() => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    if (showDeleteDialog) {
      animation[index].setValue(0);
    } else {
      Animated.timing(animation[index], {
        toValue: width / storyArr.length,
        duration:
          mediaType === "video" && videoDuration > 0 ? videoDuration : 5000,
        useNativeDriver: false,
      }).start();
    }
  }, [index, showDeleteDialog, videoDuration]);

  const handlePress = (event) => {
    const { locationX } = event.nativeEvent;
    if (locationX > screenWidth * 0.75) {
      if (index < storyArr.length - 1) {
        updateState({
          index: index + 1,
          item: storyArr[index + 1],
        });
        animation[index].setValue(0);
      } else {
        navigation.navigate("BottomTabBar");
      }
    }
    if (locationX < screenWidth * 0.25) {
      if (index !== 0) {
        updateState({
          index: index - 1,
          item: storyArr[index - 1],
        });
        animation[index].setValue(0);
      }
    }
  };

  const handlePressOut = (event) => {
    const { locationY, locationX } = event.nativeEvent;
    if (
      locationY > screenHeight * 0.4 &&
      locationX > screenWidth * 0.25 &&
      locationX < screenWidth * 0.75
    ) {
      navigation.navigate("BottomTabBar");
    }
  };

  const handlerLike = () => likeDislikeStory(token, item._id, userId);

  const handlerDelete = () => {
    deleteStory(token, item._id, userId);
    navigation.navigate("BottomTabBar");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <TouchableWithoutFeedback
        style={{ flex: 1 }}
        onPress={handlePress}
        onPressOut={handlePressOut}
      >
        <View style={{ flex: 1 }}>
          {timeLine()}
          {mediaType === "video" ? video() : image()}
        </View>
      </TouchableWithoutFeedback>
      <View
        style={{
          padding: Sizes.fixPadding,
          paddingRight: Sizes.fixPadding * 2,
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        {isUserStory ? (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => updateState({ showDeleteDialog: true })}
          >
            <Feather name="trash-2" size={26} color={Colors.errorColor} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity activeOpacity={1} onPress={handlerLike}>
            <MaterialIcons
              name={
                userLikedStories.includes(item._id)
                  ? "favorite"
                  : "favorite-border"
              }
              size={26}
              color={
                userLikedStories.includes(item._id)
                  ? Colors.errorColor
                  : "#ffffff"
              }
            />
          </TouchableOpacity>
        )}
      </View>
      {deleteDialog()}
    </SafeAreaView>
  );

  function timeLine() {
    return (
      <View style={{ flexDirection: "row", margin: Sizes.fixPadding }}>
        {storyArr.map((i, index2) => {
          return (
            <View
              key={index2}
              style={{
                width: width / storyArr.length,
                height: 2,
                borderRadius: 1.5,
                backgroundColor: "rgba(255,255,255,0.5)",
                marginLeft: index2 === 0 ? 0 : 2,
              }}
            >
              {index2 <= index && (
                <Animated.View
                  style={{
                    width:
                      index2 === index
                        ? animation[index]
                        : width / storyArr.length,
                    height: 2,
                    borderRadius: 1.5,
                    backgroundColor: "#ffffff",
                  }}
                />
              )}
            </View>
          );
        })}
      </View>
    );
  }

  function image() {
    return (
      <ImageBackground
        style={{ flex: 1, padding: Sizes.fixPadding }}
        source={{ uri: item.url }}
        resizeMode={"contain"}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: Sizes.fixPadding,
          }}
        >
          <Image
            source={
              userImage
                ? { uri: userImage }
                : require("../../assets/images/icon.png")
            }
            style={{
              width: 40.0,
              height: 40.0,
              borderRadius: 20.0,
            }}
          />
          <Text
            style={{
              ...Fonts.whiteColor16SemiBold,
              color: "#ffffff",
              marginLeft: Sizes.fixPadding,
            }}
          >
            {userName}
          </Text>
        </View>
      </ImageBackground>
    );
  }

  function video() {
    return (
      <View style={{ flex: 1, position: "relative" }}>
        <Video
          ref={videoRef}
          style={{ flex: 1, padding: Sizes.fixPadding }}
          source={{
            uri: item.url,
          }}
          resizeMode="contain"
          onLoad={(meta) => updateState({ videoDuration: meta.durationMillis })}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: Sizes.fixPadding,
            position: "absolute",
            left: Sizes.fixPadding * 2,
          }}
        >
          <Image
            source={
              userImage
                ? { uri: userImage }
                : require("../../assets/images/icon.png")
            }
            style={{
              width: 40.0,
              height: 40.0,
              borderRadius: 20.0,
            }}
          />
          <Text
            style={{
              ...Fonts.whiteColor16SemiBold,
              color: "#ffffff",
              marginLeft: Sizes.fixPadding,
            }}
          >
            {userName}
          </Text>
        </View>
      </View>
    );
  }

  function deleteDialog() {
    return (
      <Dialog
        isVisible={showDeleteDialog}
        onBackdropPress={() => updateState({ showDeleteDialog: false })}
        overlayStyle={styles.deleteDialogStyle}
      >
        <Text style={{ ...Fonts.whiteColor18SemiBold, color: "#000" }}>
          Delete this Story ?
        </Text>
        <Text style={styles.dialogTextStyle}>
          This story will deleted after 24 hours automatically, you can keep it.
        </Text>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.deleteButtonStyle}
          onPress={handlerDelete}
        >
          <Text
            style={{ ...Fonts.whiteColor18SemiBold, color: Colors.errorColor }}
          >
            Delete
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            ...styles.deleteButtonStyle,
            borderTopWidth: 0,
            borderBottomWidth: 0,
          }}
          onPress={() => updateState({ showDeleteDialog: false })}
        >
          <Text style={{ ...Fonts.whiteColor16Medium, color: "#000000" }}>
            Cancel
          </Text>
        </TouchableOpacity>
      </Dialog>
    );
  }
};

export default Story;
