import useProfileData from "../../../Data/useProfileData";
import React from "react";
import { Dimensions, FlatList, Text, View, StyleSheet } from "react-native";
import Bundle from "../../home/Bundle";
import Creator from "../../home/Creator";
import UserNotFound from "../userCards/UserNotFound";
import useLocalData from "../../../Data/localData/useLocalData";

const screenWidth = Dimensions.get("window").width;

const MyBundles = ({ navigation }) => {
  // Get Colors from the Global state
  const { Fonts, Sizes } = useLocalData((state) => state.styles);

  const styles = StyleSheet.create({
    titleWrapStyle: {
      marginBottom: Sizes.fixPadding + 5.0,
      marginHorizontal: Sizes.fixPadding * 2.0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
  });

  // Get data from global state
  const subscriptionLoading = useProfileData(
    (state) => state.subscriptionLoading
  );
  const bundles = useProfileData((state) => state.subscriptionBundles);
  const creators = useProfileData((state) => state.subscriptionCreators);

  // Handles variables
  const bundlesItem = ({ item }) => (
    <Bundle
      item={item.bundleDetails}
      style={{ marginBottom: 0, width: screenWidth / 2.2 }}
      navigation={navigation}
    />
  );

  const creatorsItem = ({ item }) => (
    <Creator item={item} style={{ marginBottom: 20 }} navigation={navigation} />
  );

  return bundles.length && creators.length ? (
    <View>
      <View>
        <View style={styles.titleWrapStyle}>
          <Text style={{ ...Fonts.whiteColor20Bold }}>Bundles</Text>
        </View>
        <FlatList
          data={bundles}
          keyExtractor={(item) => `${item._id}`}
          renderItem={bundlesItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: Sizes.fixPadding * 2.0 }}
        />
      </View>
      <View style={{ marginTop: Sizes.fixPadding * 3.0 }}>
        <View style={styles.titleWrapStyle}>
          <Text style={{ ...Fonts.whiteColor20Bold }}>Users</Text>
        </View>
        <FlatList
          data={creators}
          keyExtractor={(item) => `${item._id}`}
          renderItem={creatorsItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: Sizes.fixPadding * 2.0 }}
        />
      </View>
    </View>
  ) : (
    <UserNotFound isLoading={subscriptionLoading} />
  );
};
export default MyBundles;
