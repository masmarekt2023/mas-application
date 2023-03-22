import useProfileData from "../../../Data/useProfileData";
import React, { useLayoutEffect } from "react";
import useLoginData from "../../../Data/useLoginData";
import { Dimensions, FlatList, Text, View, StyleSheet } from "react-native";
import Creator from "../../home/Creator";
import UserNotFound from "../userCards/UserNotFound";
import useLocalData from "../../../Data/localData/useLocalData";

const screenWidth = Dimensions.get("window").width;

const MySubscribers = ({ navigation }) => {
  // Get Colors from the Global state
  const { Fonts, Sizes } = useLocalData((state) => state.styles);

  // The style Object
  const styles = StyleSheet.create({
    titleWrapStyle: {
      marginBottom: Sizes.fixPadding + 5.0,
      marginHorizontal: Sizes.fixPadding * 2.0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
  });

  // Get user's token from the Login data
  const token = useLoginData((state) => state.userInfo.token);

  // Fetch data
  const getSubscribers = useProfileData((state) => state.getSubscribers);

  // Get data from global state
  const subscribersList = useProfileData((state) => state.subscribersList);
  const subscribersLoading = useProfileData((state) => state.subscribersLoading);

  useLayoutEffect(() => {
    getSubscribers(token);
  }, []);

  // Handles variables
  const renderItem = ({ item }) => (
    <Creator
      item={item}
      style={{ marginBottom: 0, width: screenWidth / 2.2 }}
      navigation={navigation}
    />
  );

  return subscribersList.length ? (
    <View>
      <View style={styles.titleWrapStyle}>
        <Text style={{ ...Fonts.whiteColor20Bold }}>My Subscribers</Text>
      </View>
      <FlatList
        data={subscribersList}
        keyExtractor={(item) => `${item._id}`}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: Sizes.fixPadding * 2.0 }}
      />
    </View>
  ) : (
    <UserNotFound isLoading={subscribersLoading}/>
  );
};
export default MySubscribers;
