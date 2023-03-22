import React, { useState, useRef } from "react";
import { Dimensions, Animated, View, StyleSheet, Text } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import useNotificationData from "../../Data/useNotificationData";
import useLoginData from "../../Data/useLoginData";
import useLocalData from "../../Data/localData/useLocalData";

const { width } = Dimensions.get("window");
const monthsNames = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`,
];

const rowTranslateAnimatedValues = {};

const NotificationsForDay = ({ notificationsList, title }) => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes } = useLocalData((state) => state.styles);

  // The style Object
  const styles = StyleSheet.create({
    headerWrapStyle: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: Sizes.fixPadding * 2.0,
      paddingVertical: Sizes.fixPadding + 5.0,
      backgroundColor: Colors.lightWhiteColor,
      elevation: 3.0,
    },
    snackBarStyle: {
      position: "absolute",
      bottom: -10.0,
      left: -10.0,
      right: -10.0,
      backgroundColor: "#333333",
    },
    notificationWrapStyle: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors.inputBgColor,
      borderRadius: Sizes.fixPadding - 5.0,
      padding: Sizes.fixPadding + 5.0,
      marginHorizontal: Sizes.fixPadding * 2.0,
      marginBottom: Sizes.fixPadding * 2.0,
    },
    rowBack: {
      backgroundColor: Colors.primaryColor,
      flex: 1,
      marginBottom: Sizes.fixPadding * 2.0,
    },
    notificationIconWrapStyle: {
      width: 60.0,
      height: 60.0,
      borderRadius: Sizes.fixPadding * 3.0,
      alignItems: "center",
      justifyContent: "center",
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
  });

  const token = useLoginData((state) => state.userInfo.token);
  const removeNotification = useNotificationData(
    (state) => state.removeNotification
  );

  const [listData, setListData] = useState(notificationsList);

  Array(listData.length + 1)
    .fill("")
    .forEach((_, i) => {
      rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
    });

  const animationIsRunning = useRef(false);

  const onSwipeValueChange = (swipeData) => {
    const { key, value } = swipeData;
    if (
      value < -Dimensions.get("window").width &&
      !animationIsRunning.current
    ) {
      animationIsRunning.current = true;
      Animated.timing(rowTranslateAnimatedValues[key], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        const newData = [...listData];
        const prevIndex = listData.findIndex((item) => item.key === key);
        const notId = listData.find((item) => item.key === key).id;
        newData.splice(prevIndex, 1);
        removeNotification(token, notId);
        setListData(newData);

        animationIsRunning.current = false;
      });
    }
  };

  const renderItem = (data) => {
    return (
      <Animated.View
        style={[
          {
            height: rowTranslateAnimatedValues[data.item.key].interpolate({
              inputRange: ["0%", "100%"],
              outputRange: ["0%", "100%"],
            }),
          },
        ]}
      >
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
          <View style={styles.notificationWrapStyle}>
            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={1}
                style={{
                  ...Fonts.whiteColor16Medium,
                  opacity: data.item.isRead ? 0.8 : 1,
                }}
              >
                {data.item.title}
              </Text>
              <Text
                numberOfLines={data.item.description.length / 50 + 2}
                style={{ ...Fonts.grayColor13Regular }}
              >
                {data.item.description}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderHiddenItem = () => <View style={styles.rowBack} />;
  const date = new Date();
  const isToday =
    date.toDateString().slice(4) ===
    `${monthsNames[+title.slice(5, 7) - 1].slice(0, 3)} ${title.slice(
      8
    )} ${title.slice(0, 4)}`;
  const filterTitle = `${isToday ? `Today, ` : ``} ${
    monthsNames[+title.slice(5, 7) - 1]
  } ${title.slice(8)} ${title.slice(0, 4)}`;

  return listData.length === 0 ? (
    <View></View>
  ) : (
    <View>
      <Text
        style={{
          marginBottom: Sizes.fixPadding + 5.0,
          marginHorizontal: Sizes.fixPadding * 2.0,
          ...Fonts.whiteColor18Medium,
        }}
      >
        {filterTitle}
      </Text>
      <SwipeListView
        listKey={`${title}`}
        disableRightSwipe
        data={listData}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-width}
        onSwipeValueChange={onSwipeValueChange}
        useNativeDriver={false}
        scrollEnabled={true}
      />
    </View>
  );
};
export default NotificationsForDay;
