import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Bundle from "../../home/Bundle";
import React from "react";
import useBundlesData from "../../../Data/useBundlesData";
import useProfileData from "../../../Data/useProfileData";
import UserNotFound from "../userCards/UserNotFound";
import useLocalData from "../../../Data/localData/useLocalData";

const screenWidth = Dimensions.get("window").width;
const MyBundles = ({ navigation }) => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes } = useLocalData((state) => state.styles);

  const { userImage, userName, userId } = useProfileData(
    (state) => state.userData
  );

  const userBundles = useBundlesData((state) => state.myBundlesList);

  const bundlesArr = userBundles.map((i) => ({
    ...i,
    userId: { userName: userName, profilePic: userImage, _id: userId },
  }));

  return bundlesArr.length ? (
    <View
      style={{
        marginHorizontal: Sizes.fixPadding * 2.0,
      }}
    >
      <View
        style={{
          marginBottom: Sizes.fixPadding + 5.0,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={Fonts.whiteColor20Bold}>My Bundles</Text>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.push("ShareForAudience")}
          style={{
            paddingHorizontal: Sizes.fixPadding * 0.5,
            backgroundColor: Colors.primaryColor,
            borderRadius: Sizes.fixPadding - 5.0,
            paddingVertical: Sizes.fixPadding - 5.0,
          }}
        >
          <Text
            style={{
              ...Fonts.whiteColor16Medium,
              color: Colors.buttonTextColor,
            }}
          >
            Share For Audience
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={bundlesArr}
        keyExtractor={(item) => `${item._id}`}
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
  ) : (
    <UserNotFound isLoading={false} />
  );
};

export default MyBundles;
