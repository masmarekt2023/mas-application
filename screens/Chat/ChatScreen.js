import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import useChatData from "../../Data/useChatData";
import useGetAllUsersData from "../../Data/useGetAllUsersData";
import useLoginData from "../../Data/useLoginData";
import useLocalData from "../../Data/localData/useLocalData";

const ChatScreen = ({ navigation }) => {
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
    titleWrapStyle: {
      marginBottom: Sizes.fixPadding + 5.0,
      marginHorizontal: Sizes.fixPadding * 2.0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
  });

  // filter the Chat user form the userList
  const chatCreatorsId = useChatData((state) => state.chatCreatorsId);
  const onlineUsers = useChatData((state) => state.onlineUsers);
  const creatorsList = useGetAllUsersData((state) => state.allUsersList);
  const creatorsId = creatorsList.map((i) => i._id);
  const adminId = chatCreatorsId.filter((i) => !creatorsId.includes(i))[0];
  const chatUsers = [
    {
      _id: adminId,
      profilePic: "",
      name: "Admin",
      userName: "Admin",
    },
    ...creatorsList.filter((creator) => onlineUsers.includes(creator._id)),
    ...new Set(
      creatorsList.filter(
        (creator) =>
          chatCreatorsId.includes(creator._id) &&
          !onlineUsers.includes(creator._id)
      )
    ),
  ];

  const token = useLoginData((state) => state.userInfo.token);

  // handle the icons of chat and creat the chat if the creator have not chatting before
  const creatNewChat = useChatData((state) => state.creatNewChat);

  const onClickChat = (item) => {
    creatNewChat(token, item._id);
    navigation.push("chat", {
      creatorId: item._id,
      profilePic: item.profilePic,
      name: item.name,
      userName: item.userName,
    });
  };

  const unreadMessages = useChatData((state) => state.unreadMessages);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
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
          Chat
        </Text>
      </View>
    );
  }

  function chatUsersInfo() {
    const renderItem = ({ item }) => {
      const unreadUserMessages = unreadMessages.find(
        (i) => i.creatorId === item._id
      )?.messages.length;
      const isOnline = onlineUsers.includes(item._id);
      return (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => onClickChat(item)}
          style={{
            marginRight: Sizes.fixPadding * 2.0,
            marginBottom: Sizes.fixPadding * 4.0,
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
            <Image
              source={
                item.profilePic
                  ? { uri: item.profilePic }
                  : require("../../assets/images/icon.png")
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
                {item.name === "Admin"
                  ? "Online"
                  : isOnline
                  ? "Online"
                  : "Active recently"}
              </Text>
            </View>
          </View>
          {unreadUserMessages > 0 && (
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: Colors.primaryColor,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={Fonts.whiteColor12Medium}>{unreadUserMessages}</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    };
    return (
      <View style={{ marginTop: Sizes.fixPadding * 3.0, flex: 1 }}>
        <FlatList
          data={chatUsers}
          keyExtractor={(item, index) => `${index}`}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: Sizes.fixPadding * 2.0 }}
          scrollEnabled={true}
        />
      </View>
    );
  }
};

export default ChatScreen;
