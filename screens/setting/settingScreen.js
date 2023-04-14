import React, { useLayoutEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  Switch,
} from "react-native";
import { MaterialIcons, Feather, Ionicons } from "@expo/vector-icons";
import Dialog from "react-native-dialog";
import useProfileData from "../../Data/useProfileData";
import useLocalData from "../../Data/localData/useLocalData";

const { width } = Dimensions.get("window");

const SettingScreen = ({ navigation }) => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes, darkMode } = useLocalData(
    (state) => state.styles
  );

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
    editIconWrapStyle: {
      backgroundColor: Colors.primaryColor,
      width: 26.0,
      height: 26.0,
      borderRadius: 13.0,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      bottom: 0.0,
      right: 0.0,
    },
    profileInfoWrapStyle: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: Sizes.fixPadding * 2.0,
      marginVertical: Sizes.fixPadding,
    },
    profileOptionsWrapStyle: {
      marginHorizontal: Sizes.fixPadding * 2.0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    optionIconWrapStyle: {
      width: 50.0,
      height: 50.0,
      borderRadius: 25.0,
      backgroundColor: Colors.tabIconBgColor,
      alignItems: "center",
      justifyContent: "center",
    },
    dialogWrapStyle: {
      borderRadius: Sizes.fixPadding - 5.0,
      width: width - 40,
      padding: 0.0,
      backgroundColor: Colors.bodyBackColor,
    },
    cancelAndLogoutButtonStyle: {
      borderColor: Colors.primaryColor,
      borderWidth: 1.0,
      paddingVertical: Sizes.fixPadding - 4.0,
      paddingHorizontal: Sizes.fixPadding + 5.0,
      borderRadius: Sizes.fixPadding - 5.0,
    },
    cancelAndLogoutButtonWrapStyle: {
      marginTop: Sizes.fixPadding * 3.0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
    },
  });

  const { userImage, name, userName } = useProfileData(
    (state) => state.userData
  );

  const setDarkMode = useLocalData((state) => state.setDarkMode);
  const lightModeColor = useLocalData((state) => state.lightModeColor);
  const darkModeColors = useLocalData((state) => state.darkModeColors);

  const [state, setState] = useState({
    showLogoutDialog: false,
    isDarkMode: darkMode,
  });

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const { showLogoutDialog, isDarkMode } = state;

  useLayoutEffect(() => {
    isDarkMode
      ? setDarkMode(true, darkModeColors)
      : setDarkMode(false, lightModeColor);
  }, [isDarkMode]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 2.0 }}
        >
          {profileInfo()}
          {divider()}
          {profileOptions()}
        </ScrollView>
      </View>
      {logoutDialog()}
    </SafeAreaView>
  );

  function logoutDialog() {
    return (
      <Dialog.Container
        visible={showLogoutDialog}
        contentStyle={styles.dialogWrapStyle}
        headerStyle={{ margin: 0.0, padding: 0.0 }}
      >
        <View style={{ margin: Sizes.fixPadding * 2.0 }}>
          <Text style={{ lineHeight: 17.0, ...Fonts.whiteColor16SemiBold }}>
            Are you sure you want logout?
          </Text>
          <View style={styles.cancelAndLogoutButtonWrapStyle}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => updateState({ showLogoutDialog: false })}
              style={styles.cancelAndLogoutButtonStyle}
            >
              <Text style={{ ...Fonts.primaryColor14Medium }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                updateState({ showLogoutDialog: false });
                navigation.push("Login");
              }}
              style={{
                marginLeft: Sizes.fixPadding * 2.0,
                backgroundColor: Colors.primaryColor,
                ...styles.cancelAndLogoutButtonStyle,
              }}
            >
              <Text
                style={{
                  ...Fonts.whiteColor14Medium,
                  color: Colors.buttonTextColor,
                }}
              >
                Yes, Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Dialog.Container>
    );
  }

  function profileOptions() {
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.push("Wallet")}
        >
          {profileOptionSort({
            option: "My Wallet",
            optionIcon: require("../../assets/images/icons/wallet.png"),
          })}
        </TouchableOpacity>
        {divider()}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("Notification")}
        >
          {profileOptionSort({
            option: "Notifications",
            optionIcon: require("../../assets/images/icons/notification.png"),
          })}
        </TouchableOpacity>
        {divider()}
        {/*<TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.push("Faqs")}
        >
          {profileOptionSort({
            option: "FAQs",
            optionIcon: require("../../assets/images/icons/question.png"),
          })}
        </TouchableOpacity>
        {divider()}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.push("ContactUs")}
        >
          {profileOptionSort({
            option: "Contact Us",
            optionIcon: require("../../assets/images/icons/contact.png"),
          })}
        </TouchableOpacity>
        {divider()}*/}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.push("TermsAndConditions")}
        >
          {profileOptionSort({
            option: "Terms & Conditions",
            optionIcon: require("../../assets/images/icons/conditions.png"),
          })}
        </TouchableOpacity>
        {divider()}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => updateState({ showLogoutDialog: true })}
        >
          {profileOptionSort({
            option: "Logout",
            optionIcon: require("../../assets/images/icons/logout.png"),
          })}
        </TouchableOpacity>
      </View>
    );
  }

  function profileOptionSort({ option, optionIcon }) {
    return (
      <View style={styles.profileOptionsWrapStyle}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <View style={styles.optionIconWrapStyle}>
            <Image
              source={optionIcon}
              style={{
                width: 24.0,
                height: 24.0,
                resizeMode: "contain",
                tintColor: Colors.primaryColor,
              }}
            />
          </View>
          <Text
            style={{
              marginLeft: Sizes.fixPadding * 2.0,
              ...Fonts.whiteColor16Medium,
            }}
          >
            {option}
          </Text>
        </View>
        <MaterialIcons
          name="chevron-right"
          color={Colors.primaryColor}
          size={25}
        />
      </View>
    );
  }

  function divider() {
    return (
      <View
        style={{
          height: 1.0,
          backgroundColor: Colors.inputBgColor,
          margin: Sizes.fixPadding * 2.0,
        }}
      />
    );
  }

  function profileInfo() {
    return (
      <View style={styles.profileInfoWrapStyle}>
        <View>
          <Image
            source={
              userImage === ""
                ? require("../../assets/images/icon.png")
                : { uri: userImage }
            }
            style={{ width: 80.0, height: 80.0, borderRadius: 40.0 }}
          />
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.push("EditProfile")}
            style={styles.editIconWrapStyle}
          >
            <MaterialIcons name="edit" size={15} color={Colors.iconColor} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, marginLeft: Sizes.fixPadding + 5.0 }}>
          <Text style={{ ...Fonts.whiteColor18SemiBold }}>{name}</Text>
          <Text style={{ lineHeight: 15.0, ...Fonts.grayColor14Regular }}>
            @{userName}
          </Text>
        </View>
      </View>
    );
  }

  function header() {
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 2.0,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={styles.backArrowWrapStyle}>
            <MaterialIcons
              name="chevron-left"
              color={Colors.primaryColor}
              size={26}
              onPress={() => navigation.pop()}
            />
          </View>
          <Text
            numberOfLines={1}
            style={{
              marginLeft: Sizes.fixPadding * 2.0,
              ...Fonts.whiteColor22Bold,
            }}
          >
            Settings
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Switch
            trackColor={{
              false: Colors.primaryColor,
              true: Colors.primaryColor,
            }}
            thumbColor={Colors.primaryColor}
            onValueChange={() => updateState({ isDarkMode: !isDarkMode })}
            value={isDarkMode}
          />
          {!isDarkMode && (
            <Feather
              name="sun"
              size={24}
              color={Colors.primaryColor}
              style={{ marginLeft: Sizes.fixPadding }}
            />
          )}
          {isDarkMode && (
            <Ionicons
              name="moon-sharp"
              size={24}
              color={Colors.primaryColor}
              style={{ marginLeft: Sizes.fixPadding }}
            />
          )}
        </View>
      </View>
    );
  }
};

export default SettingScreen;
