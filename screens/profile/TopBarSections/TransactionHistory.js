import {
  FlatList,
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
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

  // get creator data from the item
  const isDonation = item.toDonationUser?._id === userId;
  const creator = isDonation ? item.userId : item.toDonationUser;
  const creatorPic = creator?.profilePic;

  // set the creator data in global state and show it in creator screen
  const setCreatorName = useGetUser((state) => state.setUsername);
  const getCreator = useGetUser((state) => state.getUser);

  const navToUser = () => {
    setCreatorName(creator?.userName);
    getCreator(token, navigation, userId);
  };

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
            width: 120.0,
            height: 120.0,
            borderRadius: Sizes.fixPadding - 5.0,
          }}
        />
      </TouchableOpacity>
      <View style={{ flex: 1, marginLeft: Sizes.fixPadding + 5.0 }}>
        <Text numberOfLines={1}>
          <Text onPress={navToUser} style={Fonts.whiteColor14Medium}>
            {isDonation ? `@${creator.userName}` : ``}
          </Text>
          <Text style={Fonts.grayColor14Regular}>
            {isDonation ? ` sent ` : `you sent `}{" "}
          </Text>
          <Text style={Fonts.whiteColor14Medium}>
            {item.amount} {item.coinName}
          </Text>
          <Text style={Fonts.grayColor14Regular}>
            {isDonation ? ` to you` : ` to `}
          </Text>
          <Text onPress={navToUser} style={Fonts.whiteColor14Medium}>
            {isDonation ? `` : `@${creator?.userName}`}
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
        <Text numberOfLines={1}>
          <Text style={Fonts.whiteColor12Medium}>Type: </Text>
          <Text style={Fonts.grayColor12Regular}>{item.transactionType}</Text>
        </Text>
        <Text style={Fonts.grayColor12Regular}>
          {date.toLocaleDateString()} at {date.toLocaleTimeString().slice(0, 5)}
        </Text>
      </View>
    </View>
  );
};

const TransactionHistory = ({ navigation }) => {
  // get user token from the login data
  const token = useLoginData((state) => state.userInfo.token);

  // Fetch data
  const getTransactionHistoryList = useProfileData(
    (state) => state.getTransactionHistoryList
  );

  useLayoutEffect(() => {
    getTransactionHistoryList(token);
  }, []);

  // Get data from global state
  const transactionHistoryList = useProfileData(
    (state) => state.transactionHistoryList
  );
  const transactionHistoryLoading = useProfileData(
      (state) => state.transactionHistoryLoading
  );

  return transactionHistoryList.length ? (
    <View>
      <FlatList
        data={transactionHistoryList}
        keyExtractor={(item, index) => `${index}`}
        renderItem={(item) => (
          <Action item={item.item} navigation={navigation} />
        )}
        scrollEnabled={false}
      />
    </View>
  ) : (
    <UserNotFound isLoading={transactionHistoryLoading}/>
  );
};

export default TransactionHistory;
