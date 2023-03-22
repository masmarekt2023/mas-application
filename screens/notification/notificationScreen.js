import React, { useEffect } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  View,
  Text,
  FlatList,
  ScrollView,
} from "react-native";
import useNotificationData from "../../Data/useNotificationData";
import NotificationsForDay from "./NotificationsForDay";
import useLoginData from "../../Data/useLoginData";
import useLocalData from "../../Data/localData/useLocalData";
import {MaterialIcons} from "@expo/vector-icons";

const { height } = Dimensions.get("window");

const NotificationsScreen = ({navigation}) => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes } = useLocalData((state) => state.styles);

  // Get user's token from the Login data
  const token = useLoginData((state) => state.userInfo.token);

  const readNotification = useNotificationData(
    (state) => state.readNotification
  );
  const setIsUnreadMessage = useNotificationData(
    (state) => state.setIsUnreadMessage
  );

  useEffect(() => {
    readNotification(token);
    setIsUnreadMessage(false);
  }, []);

  const notificationsArr = useNotificationData(
    (state) => state.notificationsArr
  );
  const datesOfNot = [
    ...new Set(notificationsArr.map((i) => i.createdAt.slice(0, 10))),
  ];
  const newDataArr = datesOfNot.map((date) => ({
    title: date,
    item: notificationsArr.filter(
      (item) => item.createdAt.slice(0, 10) === date
    ),
  }));
  const filterDataArr = newDataArr.map((item) => ({
    title: item.title,
    item: item.item.map((i, index) => ({
      id: i._id,
      key: index + 1,
      title: i.title,
      description: i.description,
      isRead: i.isRead,
    })),
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <ScrollView>
        {header()}
        {filterDataArr.length === 0 ? (
          <View
            style={{
              height: height - 180,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("../../assets/images/icons/bell2.png")}
              style={{ width: 50.0, height: 50.0, resizeMode: "contain" }}
            />
            <Text
              style={{
                ...Fonts.whiteColor14Regular,
                marginTop: Sizes.fixPadding,
              }}
            >
              No new notifications yet
            </Text>
          </View>
        ) : (
          <FlatList
            data={filterDataArr}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({ item }) => (
              <NotificationsForDay
                notificationsList={item.item}
                title={item.title}
              />
            )}
            scrollEnabled={true}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );

  function header() {
    return (
        <View
            style={{
              padding: Sizes.fixPadding * 2.0,
              flexDirection: "row",
              alignItems: "center",
            }}
        >
          <View style={{
            width: 40.0,
            height: 40.0,
            borderRadius: 20.0,
            backgroundColor: Colors.tabIconBgColor,
            alignItems: "center",
            justifyContent: "center",
          }}>
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
            Notifications
          </Text>
        </View>
    );
  }
};

export default NotificationsScreen;
