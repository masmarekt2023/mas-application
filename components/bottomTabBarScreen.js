import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { View, Image, StyleSheet, Text, BackHandler } from "react-native";
import ProfileScreen from "../screens/profile/profileScreen";
import HomeScreen from "../screens/home/homeScreen";
import SearchScreen from "../screens/search/searchScreen";
import AddScreen from "../screens/add/addScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import useProfileData from "../Data/useProfileData";
import useLoginData from "../Data/useLoginData";
import useCreatorsData from "../Data/useCreatorsData";
import useBundlesData from "../Data/useBundlesData";
import useGetAllUsersData from "../Data/useGetAllUsersData";
import Loading from "./Loading";
import useNotificationData from "../Data/useNotificationData";
import { Ionicons } from "@expo/vector-icons";
import ChatScreen from "../screens/Chat/ChatScreen";
import useChatData from "../Data/useChatData";
import io from "socket.io-client";
import { baseURL } from "../Data/Apiconfigs";
import useLocalData from "../Data/localData/useLocalData";
import useWithdrawData from "../Data/useWithdrawData";
import useStoryData from "../Data/useStoryData";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes } = useLocalData((state) => state.styles);

  // The style Object
  const styles = StyleSheet.create({
    bottomTabBarItemWrapStyle: {
      width: 40.0,
      height: 40.0,
      borderRadius: Sizes.fixPadding,
      alignItems: "center",
      justifyContent: "center",
    },
    animatedView: {
      backgroundColor: Colors.customAlertColor,
      position: "absolute",
      bottom: 100,
      alignSelf: "center",
      borderRadius: Sizes.fixPadding * 2.0,
      paddingHorizontal: Sizes.fixPadding + 5.0,
      paddingVertical: Sizes.fixPadding,
      justifyContent: "center",
      alignItems: "center",
    },
    tabBarStyle: {
      height: 80.0,
      borderTopWidth: 0.0,
      elevation: 3.0,
      shadowColor: Colors.primaryColor,
      backgroundColor: Colors.bodyBackColor,
    },
  });

  // Get user's token from the Login data
  const token = useLoginData((state) => state.userInfo.token);
  const { userId } = useProfileData((state) => state.userData);
  const getProfile = useProfileData((state) => state.getProfile);
  const getCreators = useCreatorsData((state) => state.getCreators);
  const getBundles = useBundlesData((state) => state.getBundles);
  const getAllUsers = useGetAllUsersData((state) => state.getAllUsers);
  const getNotifications = useNotificationData(
    (state) => state.getNotifications
  );
  const getChatList = useChatData((state) => state.getChatList);
  const chatsIds = useChatData((state) => state.chatsIds);
  const setOnlineUser = useChatData((state) => state.setOnlineUser);
  const unreadMessagesCount = useChatData((state) => state.unreadMessages)
    .map((i) => i.messages.length)
    .reduce(function (i, j) {
      return i + j;
    });
  const getTotalEarnings = useProfileData((state) => state.getTotalEarnings);
  const setNotificationsArr = useNotificationData(
    (state) => state.setNotificationsArr
  );
  const getSubscription = useProfileData((state) => state.getSubscription);
  const subscriptionCreators = useProfileData(
    (state) => state.subscriptionCreators
  );
  const getStory = useStoryData((state) => state.getStory);

  // get the Loading state for fetched data
  const profileLoading = useProfileData((state) => state.isLoading);
  const creatorsLoading = useCreatorsData((state) => state.isLoading);
  const bundlesLoading = useBundlesData((state) => state.isLoading);
  const allUsersLoading = useGetAllUsersData((state) => state.isLoading);
  const notificationsLoading = useNotificationData((state) => state.isLoading);
  const chatLoading = useChatData((state) => state.isLoading);
  const withdrawLoading = useWithdrawData((state) => state.isLoading);
  const storyLoading = useStoryData((state) => state.isLoading);
  const isLoading =
    profileLoading ||
    creatorsLoading ||
    bundlesLoading ||
    allUsersLoading ||
    notificationsLoading ||
    chatLoading ||
    withdrawLoading ||
    storyLoading;

  useEffect(() => {
    getProfile(token);
    getNotifications(token);
    getTotalEarnings(token);
    getSubscription(token);

    const socket = io(baseURL, {
      auth: {
        token: token,
      },
    });

    socket.emit("ping");

    socket.on("notify", (data) => {
      setOnlineUser(data.onlineusers);
    });

    return () => {
      socket.off("notify");
    };
  }, []);

  useLayoutEffect(() => {
    const notifySocket = io(baseURL + "/notifications", {
      forceNew: true,
      auth: {
        token: token,
      },
    });

    notifySocket.on("notification", (notifications) => {
      if (!isLoading) setNotificationsArr(notifications.reverse());
    });
  }, [notificationsLoading]);

  useEffect(() => {
    getCreators(token, userId);
    getAllUsers(userId);
    getBundles(userId);
    getChatList(token, userId);
    getStory(token, userId, userId);
  }, [userId]);

  useEffect(() => {
    subscriptionCreators.forEach((i) => getStory(token, i._id, userId));
  }, [subscriptionCreators]);

  const setUnReadMessages = useChatData((state) => state.setUnReadMessages);

  useEffect(() => {
    const socket = io(baseURL, {
      auth: {
        token: token,
      },
    });

    chatsIds.forEach((chatId) =>
      socket.on(chatId, (message) => {
        if (message.sender !== userId && message.status !== "Read") {
          setUnReadMessages(message);
        }
      })
    );

    return () => chatsIds.forEach((chatId) => socket.off(chatId));
  }, [chatsIds]);

  const backAction = () => {
    backClickCount === 1 ? BackHandler.exitApp() : _spring();
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, [backAction])
  );

  function _spring() {
    setBackClickCount(1);
    setTimeout(() => {
      setBackClickCount(0);
    }, 1000);
  }

  const [backClickCount, setBackClickCount] = useState(0);

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.iconColor,
          tabBarInactiveTintColor: Colors.primaryColor,
          tabBarStyle: { ...styles.tabBarStyle },
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name={"Home"}
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, focused }) =>
              tabIconSort({
                icon: require("../assets/images/icons/home.png"),
                focused: focused,
                color: color,
              }),
          }}
        />
        <Tab.Screen
          name={"Search"}
          component={SearchScreen}
          options={{
            tabBarIcon: ({ color, focused }) =>
              tabIconSort({
                icon: require("../assets/images/icons/search.png"),
                focused: focused,
                color: color,
              }),
          }}
        />
        <Tab.Screen
          name={"Add"}
          component={AddScreen}
          options={{
            tabBarIcon: ({ color, focused }) =>
              tabIconSort({
                icon: require("../assets/images/icons/add.png"),
                focused: focused,
                color: color,
              }),
            tabBarStyle: { display: "none" },
          }}
        />
        <Tab.Screen
          name={"chat"}
          component={ChatScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  backgroundColor: focused
                    ? Colors.primaryColor
                    : Colors.tabIconBgColor,
                  ...styles.bottomTabBarItemWrapStyle,
                }}
              >
                <Ionicons
                  name="chatbubble-outline"
                  size={25}
                  color={focused ? "#fff" : color}
                />
                {unreadMessagesCount > 0 && !focused && (
                  <View
                    style={{
                      position: "absolute",
                      top: -12,
                      right: -12,
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: Colors.primaryColor,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        ...Fonts.whiteColor12Medium,
                        color: Colors.buttonTextColor,
                      }}
                    >
                      {unreadMessagesCount}
                    </Text>
                  </View>
                )}
              </View>
            ),
          }}
        />
        <Tab.Screen
          name={"Profile"}
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, focused }) =>
              tabIconSort({
                icon: require("../assets/images/icons/user.png"),
                focused: focused,
                color: color,
              }),
          }}
        />
      </Tab.Navigator>
      {exitInfo()}
      {Loading({ isLoading: isLoading })}
    </>
  );

  function tabIconSort({ icon, focused, color }) {
    return (
      <View
        style={{
          backgroundColor: focused
            ? Colors.primaryColor
            : Colors.tabIconBgColor,
          ...styles.bottomTabBarItemWrapStyle,
        }}
      >
        <Image
          source={icon}
          style={{
            width: 24.0,
            height: 24.0,
            resizeMode: "contain",
            tintColor: color,
          }}
        />
      </View>
    );
  }

  function exitInfo() {
    return backClickCount === 1 ? (
      <View style={[styles.animatedView]}>
        <Text
          style={{
            ...Fonts.grayColor14Regular,
            color: Colors.customAlertTextColor,
          }}
        >
          Press back once again to exit
        </Text>
      </View>
    ) : null;
  }
};

export default TabNavigator;
