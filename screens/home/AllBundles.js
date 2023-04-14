import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React, { createRef, useEffect, useState } from "react";
import Bundle from "./Bundle";
import useBundlesData from "../../Data/useBundlesData";
import useLocalData from "../../Data/localData/useLocalData";
import axios from "axios";
import Apiconfigs from "../../Data/Apiconfigs";
import useProfileData from "../../Data/useProfileData";

const screenWidth = Dimensions.get("window").width;
const AllBundles = ({ navigation }) => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes } = useLocalData((state) => state.styles);

  // The style Object
  const styles = StyleSheet.create({
    backArrowWrapStyle: {
      width: 40.0,
      height: 40.0,
      borderRadius: 20.0,
      backgroundColor: Colors.tabIconBgColor,
      alignItems: "center",
      justifyContent: "center",
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
      marginTop: 0,
    },
  });

  const setLoading = useBundlesData(state => state.setLoading);

  const [bundlesFilteredList, setBundlesFilteredList] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const {userId} = useProfileData(state => state.userData);

  const getBundles = async () => {
    setLoading(true);
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.listAllNft,
        params: {
          search: search === "" ? null : search,
          limit: 10 * page,
        },
      });
      if (res.data.statusCode === 200) {
        setBundlesFilteredList(
          res.data.result.docs.filter((i) => i.userId._id !== userId)
        );
      }
    } catch (e) {
      console.log("Error in screens/home/AllBundles => getBundles");
    }
    setLoading(false);
  };

  useEffect(() => {
    const searchingTime = setTimeout(() => {
      getBundles();
    }, 300);

    return () => clearTimeout(searchingTime);
  }, [search, page]);

  const renderItem = ({ item }) => (
    <Bundle
      item={item}
      style={{ marginBottom: 20, width: screenWidth / 2.2 }}
      navigation={navigation}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <View style={{ flex: 1 }}>
        {header()}
        {searchFiled()}
        <FlatList
          data={bundlesFilteredList}
          keyExtractor={(item, index) => `${index}`}
          renderItem={renderItem}
          numColumns={2}
          style={{ marginLeft: 5 }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
        />
        {seeMore()}
      </View>
    </SafeAreaView>
  );

  function header() {
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 2.0,
          flexDirection: "row",
          alignItems: "center",
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
          All Bundles
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
          placeholderTextColor={Colors.grayColor}
          style={{ ...Fonts.whiteColor14Medium, flex: 1 }}
          selectionColor={Colors.primaryColor}
        />
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => textInput.current.focus()}
        >
          <Image
            source={require("../../assets/images/icons/search.png")}
            style={{
              width: 20.0,
              height: 20.0,
              resizeMode: "contain",
              tintColor: Colors.grayColor,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function seeMore() {
    return (
      <TouchableOpacity
        onPress={() => setPage((prevState) => ++prevState)}
        style={{ marginVertical: Sizes.fixPadding * 2, alignItems: "center" }}
      >
        <Text style={Fonts.primaryColor16Regular}>See More</Text>
      </TouchableOpacity>
    );
  }
};

export default AllBundles;
