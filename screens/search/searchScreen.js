import React, { createRef, useLayoutEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheet } from "@rneui/themed";
import useGetAllUsersData from "../../Data/useGetAllUsersData";
import DashedLine from "react-native-dashed-line";
import useGetUser from "../../Data/useGetUser";
import useLoginData from "../../Data/useLoginData";
import useBundlesData from "../../Data/useBundlesData";
import useLocalData from "../../Data/localData/useLocalData";

const screenHeight = Dimensions.get("screen").height;

const SearchScreen = ({ navigation }) => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes } = useLocalData((state) => state.styles);

  // The style Object
  const styles = StyleSheet.create({
    headerWrapStyle: {
      margin: Sizes.fixPadding * 2.0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    notificationIconWrapStyle: {
      width: 40.0,
      height: 40.0,
      borderRadius: Sizes.fixPadding,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
    },
    searchFieldWrapStyle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: Colors.inputBgColor,
      borderRadius: Sizes.fixPadding - 5.0,
      paddingHorizontal: Sizes.fixPadding + 5.0,
      paddingVertical: Sizes.fixPadding + 3.0,
      flex: 1,
    },
    filterIconWrapStyle: {
      width: 45.0,
      height: 45.0,
      backgroundColor: Colors.inputBgColor,
      borderRadius: Sizes.fixPadding,
      marginLeft: Sizes.fixPadding * 2.0,
      alignItems: "center",
      justifyContent: "center",
    },
    searchTopicWrapStyle: {
      flexDirection: "row",
      alignItems: "center",
      borderColor: Colors.primaryColor,
      borderWidth: 1.0,
      borderRadius: Sizes.fixPadding - 5.0,
      paddingVertical: Sizes.fixPadding - 3.0,
      paddingHorizontal: Sizes.fixPadding + 5.0,
      marginRight: Sizes.fixPadding * 2.0,
    },
    bottomSheetWrapStyle: {
      paddingHorizontal: 20.0,
      paddingTop: Sizes.fixPadding + 5.0,
      paddingBottom: Sizes.fixPadding * 2.0,
      borderTopLeftRadius: Sizes.fixPadding * 3.0,
      borderTopRightRadius: Sizes.fixPadding * 3.0,
      backgroundColor: Colors.bodyBackColor,
      height: screenHeight * 0.8,
    },
    animatedView: {
      backgroundColor: "#333333",
      position: "absolute",
      bottom: 0,
      alignSelf: "center",
      borderRadius: Sizes.fixPadding * 2.0,
      paddingHorizontal: Sizes.fixPadding + 5.0,
      paddingVertical: Sizes.fixPadding,
      justifyContent: "center",
      alignItems: "center",
    },
    minMaxPriceTextFieldStyle: {
      ...Fonts.whiteColor16Regular,
      backgroundColor: Colors.inputBgColor,
      paddingHorizontal: Sizes.fixPadding,
      flex: 0.8,
      paddingVertical: Sizes.fixPadding - 5.0,
      borderRadius: Sizes.fixPadding - 5.0,
    },
    optionStyle: {
      borderColor: Colors.primaryColor,
      paddingVertical: Sizes.fixPadding - 5.0,
      marginBottom: Sizes.fixPadding + 5.0,
      paddingHorizontal: Sizes.fixPadding + 5.0,
      borderRadius: Sizes.fixPadding - 5.0,
    },
    applyButtonStyle: {
      flex: 1,
      marginLeft: Sizes.fixPadding * 3.0,
      backgroundColor: Colors.primaryColor,
      paddingVertical: Sizes.fixPadding + 5.0,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: Sizes.fixPadding - 5.0,
    },
    resetAndApplyInfoWrapStyle: {
      marginBottom: Sizes.fixPadding,
      marginTop: Sizes.fixPadding * 2.0,
      flexDirection: "row",
      alignItems: "center",
    },
  });

  // get user token from the login data
  const token = useLoginData((state) => state.userInfo.token);

  // Get the list of Creators and the List of User from the global state
  const allUserList = useGetAllUsersData((state) => state.allUsersList);
  const allBundleList = useBundlesData((state) => state.bundlesList);

  // set the data of the Creator in the global state and navigate to Creator Screen
  const setUsername = useGetUser((state) => state.setUsername);
  const getUser = useGetUser((state) => state.getUser);
  const navToCreatorScreen = (item) => {
    setUsername(item.userName);
    getUser(token, navigation, item._id);
  };

  // get the list of bundle content from the global state
  const getBundleContentList = useBundlesData(
    (state) => state.getBundleContentList
  );

  // Handle Variables
  const [state, setState] = useState({
    search: "",
    showFilterSheet: false,
    selectedSearchType: "Creator",
    creatorSearchKey: "name",
    creatorsList: [],
    bundleList: [],
    amount: { min: "", max: "" },
    coinName: "MAS",
    duration: { min: "", max: "" },
  });

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const {
    search,
    showFilterSheet,
    selectedSearchType,
    creatorSearchKey,
    creatorsList,
    amount,
    bundleList,
    coinName,
    duration,
  } = state;

  useLayoutEffect(() => {
    const searchingTime = setTimeout(() => {
      if (selectedSearchType === "Creator") {
        if (search !== "") {
          updateState({
            creatorsList: allUserList.filter((i) =>
              i[`${creatorSearchKey}`]
                .toLowerCase()
                .includes(search.toLowerCase())
            ),
          });
        } else {
          updateState({ creatorsList: [] });
        }
      } else {
        if (search !== "") {
          const filterAmount = {
            min: amount.min !== "" ? amount.min : 0,
            max: amount.max !== "" ? amount.max : 100000,
          };
          const filterDuration = {
            min: duration.min !== "" ? duration.min : 0,
            max: duration.max !== "" ? duration.max : 100000,
          };
          updateState({
            bundleList: allBundleList
              .filter(
                (i) =>
                  +i.donationAmount >= filterAmount.min &&
                  +i.donationAmount <= filterAmount.max
              )
              .filter((i) => i.coinName === coinName)
              .filter(
                (i) =>
                  +i.duration.split(" ")[0] >= filterDuration.min &&
                  +i.duration.split(" ")[0] <= filterDuration.max
              )
              .filter((i) =>
                i.bundleTitle.toLowerCase().includes(search.toLowerCase())
              ),
          });
        } else {
          updateState({ bundleList: [] });
        }
      }
    }, 1000);
    return () => clearTimeout(searchingTime);
  }, [search, amount, duration, coinName, creatorSearchKey]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
        {serachFieldAndFilterOption()}
        {searchTopicsInfo()}
        <FlatList ListHeaderComponent={<>{resultSearchesInfo()}</>} />
      </View>
      {filterSheet()}
    </SafeAreaView>
  );

  function filterSheet() {
    return (
      <BottomSheet
        isVisible={showFilterSheet}
        containerStyle={{ backgroundColor: "rgba(0.5, 0.50, 0, 0.50)" }}
        onBackdropPress={() => updateState({ showFilterSheet: false })}
      >
        <View style={styles.bottomSheetWrapStyle}>
          <Text
            style={{
              marginBottom: Sizes.fixPadding * 2.0,
              textAlign: "center",
              ...Fonts.whiteColor20Bold,
            }}
          >
            Select Filter
          </Text>
          <View style={{ flex: 1 }}>
            {selectedSearchType === "Creator" ? (
              <>{creatorSearchKeyInfo()}</>
            ) : (
              <>
                {amountInfo()}
                {coinNameInfo()}
                {durationInfo()}
              </>
            )}
          </View>
          {selectedSearchType !== "Creator" && resetAndApplyInfo()}
        </View>
      </BottomSheet>
    );
  }

  function resetAndApplyInfo() {
    const onReset = () => {
      updateState({
        amount: { min: "", max: "" },
        coinName: "MAS",
        duration: { min: "", max: "" },
      });
    };
    return (
      <View style={styles.resetAndApplyInfoWrapStyle}>
        <TouchableOpacity activeOpacity={0.9} onPress={onReset}>
          <Text style={{ ...Fonts.primaryColor20SemiBold }}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            updateState({ showFilterSheet: false });
          }}
          style={styles.applyButtonStyle}
        >
          <Text
            style={{
              ...Fonts.whiteColor20SemiBold,
              color: Colors.buttonTextColor,
            }}
          >
            Apply
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function creatorSearchKeyInfo() {
    const list = ["name", "userName", "speciality"];
    return (
      <View>
        <Text style={{ ...Fonts.whiteColor18SemiBold }}>Searching by</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {list.map((item, index) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                updateState({ creatorSearchKey: item, showFilterSheet: false })
              }
              key={`${index}`}
              style={{
                marginRight:
                  index === list.length - 1 ? 0.0 : Sizes.fixPadding * 2.0,
                backgroundColor:
                  creatorSearchKey === item
                    ? Colors.primaryColor
                    : Colors.bodyBackColor,
                borderWidth: creatorSearchKey === item ? 0 : 1,
                ...styles.optionStyle,
              }}
            >
              <Text
                style={
                  creatorSearchKey === item
                    ? {
                        ...Fonts.whiteColor16Regular,
                        color: Colors.buttonTextColor,
                      }
                    : { ...Fonts.primaryColor16Regular }
                }
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  function coinNameInfo() {
    const list = ["MAS", "USDT", "BUSD"];
    return (
      <View>
        <Text style={{ ...Fonts.whiteColor18SemiBold }}>Coin Name</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {list.map((item, index) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => updateState({ coinName: item })}
              key={`${index}`}
              style={{
                marginRight:
                  index === list.length - 1 ? 0.0 : Sizes.fixPadding * 2.0,
                backgroundColor:
                  coinName === item
                    ? Colors.primaryColor
                    : Colors.bodyBackColor,
                borderWidth: coinName === item ? 0 : 1,
                ...styles.optionStyle,
              }}
            >
              <Text
                style={
                  coinName === item
                    ? {
                        ...Fonts.whiteColor16Regular,
                        color: Colors.buttonTextColor,
                      }
                    : { ...Fonts.primaryColor16Regular }
                }
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  function amountInfo() {
    return (
      <View
        style={{
          marginTop: Sizes.fixPadding,
          marginBottom: Sizes.fixPadding * 2.0,
        }}
      >
        <Text
          style={{
            marginBottom: Sizes.fixPadding,
            ...Fonts.whiteColor18SemiBold,
          }}
        >
          Amount
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            value={`${amount.min}`}
            onChangeText={(value) =>
              updateState({
                amount: { min: value > 0 ? value : "", max: amount.max },
              })
            }
            placeholder="Min"
            placeholderTextColor={Colors.whiteColor}
            style={styles.minMaxPriceTextFieldStyle}
            selectionColor={Colors.primaryColor}
            keyboardType="numeric"
          />
          <Text
            style={{
              marginHorizontal: Sizes.fixPadding * 2.0,
              ...Fonts.grayColor14Regular,
            }}
          >
            to
          </Text>
          <TextInput
            value={`${amount.max}`}
            onChangeText={(value) =>
              updateState({
                amount: { min: amount.min, max: value > 0 ? value : "" },
              })
            }
            placeholder="Max"
            placeholderTextColor={Colors.whiteColor}
            style={styles.minMaxPriceTextFieldStyle}
            selectionColor={Colors.primaryColor}
            keyboardType="numeric"
          />
        </View>
      </View>
    );
  }

  function durationInfo() {
    return (
      <View
        style={{
          marginTop: Sizes.fixPadding,
          marginBottom: Sizes.fixPadding * 2.0,
        }}
      >
        <Text
          style={{
            marginBottom: Sizes.fixPadding,
            ...Fonts.whiteColor18SemiBold,
          }}
        >
          Duration
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            value={`${duration.min}`}
            onChangeText={(value) =>
              updateState({
                duration: { min: value > 0 ? value : "", max: duration.max },
              })
            }
            placeholder="Min Day"
            placeholderTextColor={Colors.whiteColor}
            style={styles.minMaxPriceTextFieldStyle}
            selectionColor={Colors.primaryColor}
            keyboardType="numeric"
          />
          <Text
            style={{
              marginHorizontal: Sizes.fixPadding * 2.0,
              ...Fonts.grayColor14Regular,
            }}
          >
            to
          </Text>
          <TextInput
            value={`${duration.max}`}
            onChangeText={(value) =>
              updateState({
                duration: { min: duration.min, max: value > 0 ? value : "" },
              })
            }
            placeholder="Max Day"
            placeholderTextColor={Colors.whiteColor}
            style={styles.minMaxPriceTextFieldStyle}
            selectionColor={Colors.primaryColor}
            keyboardType="numeric"
          />
        </View>
      </View>
    );
  }

  function resultSearchesInfo() {
    const renderCreatorItem = ({ item }) => (
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          marginBottom: Sizes.fixPadding * 2,
        }}
        onPress={() => navToCreatorScreen(item)}
      >
        <Image
          source={
            item.profilePic
              ? { uri: item.profilePic }
              : require("../../assets/images/icon.png")
          }
          style={{ width: 50.0, height: 50.0, borderRadius: 25 }}
        />
        <View style={{ marginLeft: Sizes.fixPadding + 5.0 }}>
          <Text style={{ ...Fonts.whiteColor16Medium }}>{item.name}</Text>
          <Text style={{ lineHeight: 15.0, ...Fonts.grayColor13Regular }}>
            @{item.userName}
          </Text>
        </View>
      </TouchableOpacity>
    );

    const renderBundleItem = ({ item }) => (
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          marginBottom: Sizes.fixPadding * 2,
        }}
        onPress={() => {
          getBundleContentList(token, item._id);
          navigation.push("LiveAuctionsDetail", {
            item: item,
            showPayDialog: false,
          });
        }}
      >
        <Image
          source={{ uri: item.mediaUrl }}
          style={{ width: 50.0, height: 50.0 }}
        />
        <View style={{ marginLeft: Sizes.fixPadding + 5.0 }}>
          <Text style={{ ...Fonts.whiteColor16Medium }}>
            {item.bundleTitle}
          </Text>
          <Text style={{ lineHeight: 15.0, ...Fonts.grayColor13Regular }}>
            {item.donationAmount} {item.coinName} for {item.duration}
          </Text>
        </View>
      </TouchableOpacity>
    );

    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <DashedLine
          dashLength={5}
          dashColor={Colors.inputBgColor}
          dashGap={5}
          style={{ marginBottom: Sizes.fixPadding * 2 }}
        />
        <FlatList
          data={
            search === ""
              ? []
              : selectedSearchType === "Creator"
              ? creatorsList
              : bundleList
          }
          keyExtractor={(item, index) => `${index}`}
          renderItem={
            selectedSearchType === "Creator"
              ? renderCreatorItem
              : renderBundleItem
          }
        />
      </View>
    );
  }

  function searchTopicsInfo() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        style={{
          ...styles.searchTopicWrapStyle,
          borderWidth: item === selectedSearchType ? 0 : 1,
          backgroundColor:
            item === selectedSearchType
              ? Colors.primaryColor
              : Colors.bodyBackColor,
        }}
        onPress={() => updateState({ selectedSearchType: item, search: "" })}
      >
        <Text
          style={
            item === selectedSearchType
              ? { ...Fonts.whiteColor14Regular, color: Colors.buttonTextColor }
              : Fonts.primaryColor14Regular
          }
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
    return (
      <View>
        <FlatList
          data={["Creator", "Bundle"]}
          keyExtractor={(item, index) => `${index}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingLeft: Sizes.fixPadding * 2.0,
            paddingVertical: Sizes.fixPadding * 3.0,
          }}
        />
      </View>
    );
  }

  function serachFieldAndFilterOption() {
    const textInput = createRef();
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: Sizes.fixPadding * 2.0,
        }}
      >
        <View style={styles.searchFieldWrapStyle}>
          <TextInput
            ref={textInput}
            value={search}
            onChangeText={(value) => updateState({ search: value })}
            placeholder={`Search for ${selectedSearchType} ${
              selectedSearchType === "Creator" ? `by ${creatorSearchKey}` : ``
            }`}
            placeholderTextColor={Colors.grayColor}
            style={{ ...Fonts.whiteColor16Regular, flex: 1 }}
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
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            updateState({ showFilterSheet: true });
          }}
          style={styles.filterIconWrapStyle}
        >
          <MaterialIcons
            name="filter-list"
            size={24}
            color={Colors.whiteColor}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function header() {
    return (
      <View style={styles.headerWrapStyle}>
        <Text numberOfLines={1} style={{ flex: 1, ...Fonts.whiteColor22Bold }}>
          Search
        </Text>
      </View>
    );
  }
};

export default SearchScreen;
