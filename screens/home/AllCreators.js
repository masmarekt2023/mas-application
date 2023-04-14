import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
    Dimensions
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React, { createRef, useLayoutEffect, useState } from "react";
import Creator from "./Creator";
import useLocalData from "../../Data/localData/useLocalData";
import axios from "axios";
import Apiconfigs from "../../Data/Apiconfigs";
import useGetAllUsersData from "../../Data/useGetAllUsersData";
import useProfileData from "../../Data/useProfileData";

const {width, height} = Dimensions.get('screen');

const screenWidth = width < height ? width : height

const AllCreators = ({ navigation }) => {
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

  const {userId} = useProfileData(state => state.userData);

  const [creatorsList, setCreatorsList] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const setLoading = useGetAllUsersData(state => state.setLoading);
  const getAllUsers = async () => {
    setLoading(true);
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.allUserList,
        params: {
          search: search === "" ? null : search,
          limit: 10 * page,
        },
      });
      if (res.data.statusCode === 200) {
        setCreatorsList(res.data.result.docs.filter(i => i._id !== userId));
      }
    } catch (error) {
      console.log("Error in screens/home/AllCreators => getAllUsers");
    }
    setLoading(false);
  }

  const renderItem = ({ item }) => (
    <Creator item={item} style={{ marginBottom: 20, width: screenWidth * 0.45 }} navigation={navigation} />
  );

  useLayoutEffect(() => {
    const searchingTime = setTimeout(() => {
      getAllUsers();
    }, 300);

    return () => clearTimeout(searchingTime);
  }, [search, page]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <View style={{ flex: 1 }}>
        {header()}
        {searchFiled()}
        <FlatList
          data={creatorsList}
          keyExtractor={(item) => `${item._id}`}
          renderItem={renderItem}
          numColumns={2}
          style={{ marginLeft: 5 }}
          columnWrapperStyle={{ width: width }}
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
          All Creators
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

export default AllCreators;
