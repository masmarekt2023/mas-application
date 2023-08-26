import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import useLocalData from "../../Data/localData/useLocalData";
import { Video } from "expo-av";
import moment from "moment/moment";
import useProfileData from "../../Data/useProfileData";

const { width } = Dimensions.get("window");

const AudienceScreen = ({ navigation, route }) => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes } = useLocalData((state) => state.styles);
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
      borderRadius: 20,
      backgroundColor: Colors.tabIconBgColor,
      alignItems: "center",
      justifyContent: "center",
    },
    auctionImageStyle: {
      height: width - Sizes.fixPadding * 6,
      borderRadius: Sizes.fixPadding,
      marginHorizontal: Sizes.fixPadding * 3.0,
      width: width - Sizes.fixPadding * 6,
      marginTop: Sizes.fixPadding,
      marginBottom: Sizes.fixPadding + 5.0,
    },
    placeBidButtonStyle: {
      backgroundColor: Colors.primaryColor,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: Sizes.fixPadding + 5.0,
      borderRadius: Sizes.fixPadding - 5.0,
      marginVertical: Sizes.fixPadding * 2.0,
    },
  });

  const item = route.params.item;
  const userId = useProfileData((state) => state.userData.userId);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      {Header()}
      {Media()}
      {AuctionInfo()}
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          paddingBottom: Sizes.fixPadding * 3,
        }}
      >
        {item.userId === userId && EditButton()}
      </View>
    </SafeAreaView>
  );

  function EditButton() {
    const onPress = () => navigation.push("ShareForAudience", { item: item });
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          ...styles.placeBidButtonStyle,
        }}
      >
        <Text
          style={{
            ...Fonts.whiteColor20SemiBold,
            color: Colors.buttonTextColor,
          }}
        >
          Edit Audience
        </Text>
      </TouchableOpacity>
    );
  }

  function AuctionInfo() {
    const date = moment(item.createdAt);
    const formatDate = `${date.format("MMM DD,YYYY")} at ${date.format("LT")}`;
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 3,
        }}
      >
        <Text style={{ ...Fonts.whiteColor20Bold }}>{item.title}</Text>
        <Text>
          <Text style={Fonts.whiteColor14SemiBold}>Details: </Text>
          <Text style={Fonts.grayColor14Regular}>{item.details}</Text>
        </Text>
        <Text>
          <Text style={Fonts.whiteColor14SemiBold}>Type: </Text>
          <Text style={Fonts.grayColor14Regular}>{item.postType}</Text>
        </Text>
        <Text>
          <Text style={Fonts.whiteColor14SemiBold}>Date: </Text>
          <Text style={Fonts.grayColor14Regular}>{formatDate}</Text>
        </Text>
      </View>
    );
  }

  function Media() {
    return isVideo(item.mediaUrl) ? (
      <Video
        source={{ uri: item.mediaUrl }}
        style={styles.auctionImageStyle}
        shouldPlay
        useNativeControls
        resizeMode={"stretch"}
      />
    ) : (
      <Image
        source={{ uri: item.mediaUrl }}
        style={styles.auctionImageStyle}
        resizeMode={"stretch"}
      />
    );
  }

  function Header() {
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
            {item.title}
          </Text>
        </View>
      </View>
    );
  }

  function isVideo(uri) {
    const videoFormats = ["mp4", "avi", "mkv", "mov", "wmv", "flv", "webm"];
    const urlFormat = uri.split(".")[uri.split(".").length - 1];
    return videoFormats.includes(urlFormat);
  }
};
export default AudienceScreen;
