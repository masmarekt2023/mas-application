import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { createRef, useLayoutEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import useLocalData from "../../../Data/localData/useLocalData";
import axios from "axios";
import Apiconfigs from "../../../Data/Apiconfigs";
import useProfileData from "../../../Data/useProfileData";

const TransferFunds = ({ navigation }) => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes } = useLocalData((state) => state.styles);

  // The style Object
  const styles = StyleSheet.create({
    backArrowWrapStyle: {
      width: 40.0,
      height: 40.0,
      borderRadius: 30.0,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.tabIconBgColor,
    },
    titleWrapStyle: {
      marginBottom: Sizes.fixPadding + 5.0,
      marginHorizontal: Sizes.fixPadding * 2.0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    searchFieldWrapStyle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: Colors.inputBgColor,
      borderRadius: Sizes.fixPadding - 5.0,
      paddingHorizontal: Sizes.fixPadding + 5.0,
      paddingVertical: Sizes.fixPadding,
      margin: Sizes.fixPadding * 2.0,
      marginBottom: 0,
    },
  });

  const {userId} = useProfileData(state => state.userData);

  const getAllUsers = async () => {
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.allUserList,
        params: {
          search: search.length > 0 ? search : null,
          limit: 10,
        },
      });
        if (res.data.statusCode === 200) {
            setCreatorsList(res.data.result.docs.filter(i => i._id !== userId));
        }
    } catch (error) {
      console.log("Error in TransferFunds / getAllUsers");
    }
  };

  // filter the Chat user form the userList
  const [creatorsList, setCreatorsList] = useState([]);

  const [search, setSearch] = useState("");

  useLayoutEffect(() => {
    const searchingTime = setTimeout(() => {
      getAllUsers()
    }, 300);

    return () => clearTimeout(searchingTime);
  }, [search]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
        {searchFiled()}
        {chatUsersInfo()}
      </View>
    </SafeAreaView>
  );

  function header() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 2.0,
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 1,
          borderColor: Colors.primaryColor,
        }}
      >
        <View style={styles.backArrowWrapStyle}>
          <MaterialIcons
            name="chevron-left"
            color={Colors.primaryColor}
            size={26}
            onPress={() => navigation.goBack()}
          />
        </View>
        <Text
          numberOfLines={1}
          style={{
            marginLeft: Sizes.fixPadding * 2.0,
            flex: 1,
            ...Fonts.whiteColor22Bold,
          }}
        >
          Select User
        </Text>
      </View>
    );
  }

  function searchFiled() {
    const textInput = createRef();
    return (
      <View style={styles.searchFieldWrapStyle}>
        <TextInput
          ref={textInput}
          value={search}
          onChangeText={(value) => setSearch(value)}
          placeholder="Search"
          placeholderTextColor={Colors.inputTextColor}
          style={{
            ...Fonts.whiteColor14Medium,
            flex: 1,
            color: Colors.inputTextColor,
          }}
          selectionColor={Colors.primaryColor}
        />
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => textInput.current.focus()}
        >
          <Image
            source={require("../../../assets/images/icons/search.png")}
            style={{
              width: 20.0,
              height: 20.0,
              resizeMode: "contain",
              tintColor: Colors.inputTextColor,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function chatUsersInfo() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() =>
          navigation.push("ConnectWallet", {
            selectNav: "donate",
            title: "Transfer Funds",
            walletAddress: item.walletAddress,
          })
        }
        style={{
          marginRight: Sizes.fixPadding * 2.0,
          marginBottom: Sizes.fixPadding * 4.0,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Image
          source={
            item.profilePic
              ? { uri: item.profilePic }
              : require("../../../assets/images/icon.png")
          }
          style={{ width: 55.0, height: 55.0, borderRadius: 27.5 }}
        />
        <View style={{ marginLeft: Sizes.fixPadding + 5.0 }}>
          <Text style={{ ...Fonts.whiteColor16SemiBold }}>{item.name}</Text>
          <Text
            style={{
              marginTop: Sizes.fixPadding - 7.0,
              lineHeight: 15.0,
              ...Fonts.grayColor14Regular,
            }}
          >
            @{item.userName}
          </Text>
        </View>
      </TouchableOpacity>
    );
    return (
      <View style={{ marginTop: Sizes.fixPadding * 3.0, flex: 1 }}>
        <FlatList
          data={creatorsList}
          keyExtractor={(item) => `${item._id}`}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: Sizes.fixPadding * 2.0 }}
          scrollEnabled={true}
        />
      </View>
    );
  }
};

export default TransferFunds;
