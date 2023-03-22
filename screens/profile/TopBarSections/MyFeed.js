import useProfileData from "../../../Data/useProfileData";
import React, { useLayoutEffect } from "react";
import useLoginData from "../../../Data/useLoginData";
import { Dimensions, FlatList, Text, View } from "react-native";
import Feed from "../userCards/Feed";
import UserNotFound from "../userCards/UserNotFound";
import useLocalData from "../../../Data/localData/useLocalData";

const screenWidth = Dimensions.get("window").width;

const MyFeed = ({ navigation }) => {
  // Get Colors from the Global state
  const { Fonts, Sizes } = useLocalData((state) => state.styles);

  // Get user's token from the Login data
  const token = useLoginData((state) => state.userInfo.token);

  // Fetch data
  const getFeed = useProfileData((state) => state.getFeed);

  // Get data from global state
  const feedList = useProfileData((state) => state.feedList);
  const feedLoading = useProfileData((state) => state.feedLoading);

  useLayoutEffect(() => {
    getFeed(token);
  }, []);

  // Handles variables
  const renderItem = ({ item }) => (
    <Feed
      item={item}
      style={{ marginBottom: 20, width: screenWidth * 0.9 }}
      navigation={navigation}
    />
  );

  return feedList.length ? (
    <View
      style={{
        marginHorizontal: Sizes.fixPadding * 2.0,
      }}
    >
      <Text
        style={{
          marginBottom: Sizes.fixPadding + 5.0,
          ...Fonts.whiteColor20Bold,
        }}
      >
        My Feed
      </Text>
      <FlatList
        data={feedList}
        keyExtractor={(item) => `${item._id}`}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    </View>
  ) : (
    <UserNotFound isLoading={feedLoading}/>
  );
};
export default MyFeed;
