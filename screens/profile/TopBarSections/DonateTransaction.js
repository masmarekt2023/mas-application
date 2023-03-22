import {
  FlatList,
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import useGetAllUsersData from "../../../Data/useGetAllUsersData";
import useGetUser from "../../../Data/useGetUser";
import useLoginData from "../../../Data/useLoginData";
import useProfileData from "../../../Data/useProfileData";
import React, { useLayoutEffect } from "react";
import useLocalData from "../../../Data/localData/useLocalData";
import UserNotFound from "../userCards/UserNotFound";

const Action = ({ item, navigation }) => {
  // Get Colors from the Global state
  const { Fonts, Sizes } = useLocalData((state) => state.styles);

  // The style Object
  const styles = StyleSheet.create({
    activityInfoWrapStyle: {
      marginHorizontal: Sizes.fixPadding * 2.0,
      marginBottom: Sizes.fixPadding * 2.0,
      flexDirection: "row",
      alignItems: "center",
    },
  });

  // get user token from the login data
  const token = useLoginData((state) => state.userInfo.token);

  // get the user id from the user profile data
  const userId = useProfileData((state) => state.userData.userId);

  // get creators Data from global state
  const creator = useGetAllUsersData((state) => state.allUsersList).filter(
    (i) => i._id === item.toDonationUser._id
  )[0];
  const creatorPic = creator?.profilePic;

  // set the creator data in global state and show it in creator screen
  const setCreatorName = useGetUser((state) => state.setUsername);
  const getCreator = useGetUser((state) => state.getUser);

  const navToUser = () => {
    setCreatorName(creator.userName);
    getCreator(token, navigation, userId);
  };

  /* handle Variables */

  // Formatting date
  const date = new Date(item.createdAt);

  // copy Receipt id to Clipboard
  const copyToClipboard = useLocalData((state) => state.copyToClipboard);

  return (
    <View style={styles.activityInfoWrapStyle}>
      <TouchableOpacity activeOpacity={0.9} onPress={navToUser}>
        <Image
          source={
            creatorPic
              ? { uri: creatorPic }
              : require("../../../assets/images/icon.png")
          }
          style={{
            width: 100.0,
            height: 100.0,
            borderRadius: Sizes.fixPadding - 5.0,
          }}
        />
      </TouchableOpacity>
      <View style={{ flex: 1, marginLeft: Sizes.fixPadding + 5.0 }}>
        <Text numberOfLines={1}>
          <Text style={Fonts.grayColor14Regular}>you sent </Text>
          <Text style={Fonts.whiteColor14Medium}>
            {item.amount} {item.coinName}
          </Text>
          <Text style={Fonts.grayColor14Regular}> to </Text>
          <Text onPress={navToUser} style={Fonts.whiteColor14Medium}>
            @{item.toDonationUser.userName}
          </Text>
        </Text>
        <Text numberOfLines={1} onPress={() => copyToClipboard(item._id)}>
          <Text style={Fonts.whiteColor12Medium}>Receipt Id: </Text>
          <Text style={Fonts.grayColor12Regular}>{item._id}</Text>
        </Text>
        <Text numberOfLines={1}>
          <Text style={Fonts.whiteColor12Medium}>Status: </Text>
          <Text style={Fonts.grayColor12Regular}>{item.transactionStatus}</Text>
        </Text>
        <Text style={Fonts.grayColor12Regular}>
          {date.toLocaleDateString()} at {date.toLocaleTimeString().slice(0, 5)}
        </Text>
      </View>
    </View>
  );
};

const DonateTransaction = ({ navigation }) => {
  // get user token from the login data
  const token = useLoginData((state) => state.userInfo.token);

  // Fetch data
  const getDonationTransactionList = useProfileData(
    (state) => state.getDonationTransactionList
  );

  useLayoutEffect(() => {
    getDonationTransactionList(token);
  }, []);

  // Get data from global state
  const donationTransactionLoading = useProfileData(
      (state) => state.donationTransactionLoading
  );
  const donationTransactionList = useProfileData(
    (state) => state.donationTransactionList
  );

  return donationTransactionList.length ? (
    <View>
      <FlatList
        data={donationTransactionList}
        keyExtractor={(item) => `${item._id}`}
        renderItem={(item) => (
          <Action item={item.item} navigation={navigation} />
        )}
        scrollEnabled={false}
      />
    </View>
  ) : (
    <UserNotFound isLoading={donationTransactionLoading}/>
  );
};

export default DonateTransaction;
