import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  TextInput,
  ImageBackground,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  MaterialIcons,
  Ionicons,
  FontAwesome5,
  Entypo,
  AntDesign,
} from "@expo/vector-icons";
import moment from "moment";
import useChatData from "../../Data/useChatData";
import useProfileData from "../../Data/useProfileData";
import useLoginData from "../../Data/useLoginData";
import io from "socket.io-client";
import { baseURL } from "../../Data/Apiconfigs";
import { showMessage } from "react-native-flash-message";
import useLocalData from "../../Data/localData/useLocalData";
import * as ImagePicker from "expo-image-picker";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const UserChatScreen = ({ navigation, route }) => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes } = useLocalData((state) => state.styles);

  // The style Object
  const styles = StyleSheet.create({
    backArrowWrapStyle: {
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.tabIconBgColor,
      marginRight: Sizes.fixPadding,
    },
    titleWrapStyle: {
      marginBottom: Sizes.fixPadding + 5.0,
      marginHorizontal: Sizes.fixPadding * 2.0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    messagesDateStyle: {
      padding: 5,
      borderRadius: 5,
      backgroundColor: Colors.primaryColor,
      color: Colors.buttonTextColor,
      fontWeight: "bold",
    },
    receivedMessagesStyle: {
      paddingHorizontal: Sizes.fixPadding,
      paddingVertical: Sizes.fixPadding * 0.5,
      borderRadius: Sizes.fixPadding * 0.5,
      color: Colors.whiteColor,
      marginLeft: 5,
    },
    messageHandleContainerStyle: {
      position: "absolute",
      bottom: 5,
      flexDirection: "row",
      width: screenWidth,
      paddingHorizontal: Sizes.fixPadding / 2,
    },
    inputContainerStyle: {
      flex: 1,
      backgroundColor: Colors.inputBgColor,
      borderRadius: 20,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: Sizes.fixPadding,
    },
    sendButtonStyle: {
      width: 45,
      height: 45,
      borderRadius: 22.5,
      marginLeft: Sizes.fixPadding / 2,
      backgroundColor: Colors.primaryColor,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  // Get token from the global state
  const token = useLoginData((state) => state.userInfo.token);

  // Listen to the messages
  const socket = io(baseURL, {
    auth: {
      token: token,
    },
  });

  // get user id from the global state
  const userId = useProfileData((state) => state.userData.userId);

  // get chat id from the global state
  const chatId = useChatData((state) => state.newChatId);

  // get creator data form the navigation router
  const { creatorId, profilePic, name } = route.params;

  // get user chat from the global state
  const userChat = useChatData((item) => item.userChat);

  // get the online user ids from the global state
  const onlineUser = useChatData((state) => state.onlineUsers);

  // get the chat handler method from the global state
  const setChatCreatorsId = useChatData((state) => state.setChatCreatorsId);

  // read the message and fetch the data to server side
  const readMessages = useChatData((state) => state.readMessages);
  const readUserChat = useChatData((state) => state.readUserChat);

  // Upload Image
  const uploadImage = useChatData((state) => state.uploadImage);
  const imageUrl = useChatData((state) => state.chatImageUrl);
  const setChatImageUrl = useChatData((state) => state.setChatImageUrl);

  // Handle Variables
  const [state, setState] = useState({
    result: [],
    message: "",
    unreadMessages: [],
    openFileSender: false,
    cameraOpen: false,
  });

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const { result, message, unreadMessages, openFileSender, cameraOpen } = state;

  // If the chat is a new chat then add the creator id to it
  useEffect(() => {
    setChatCreatorsId(creatorId);
    readUserChat(chatId);
  }, []);

  // Handle the result of the selected chat and sort it by the time
  useEffect(() => {
    // Filter the messages that unread from the chat
    updateState({
      unreadMessages: userChat
        .filter((i) => i.status === "Unread")
        .filter((i) => i.sender === creatorId)
        .map((i) => i._id),
    });

    const today = new Date();

    const datesOfChat = [
      ...new Set([
        today.toLocaleDateString().slice(0, 10),
        ...userChat.map((i) => {
          const date = new Date(i?.createdAt);
          return date.toLocaleDateString().slice(0, 10);
        }),
      ]),
    ];

    const newDataArr = datesOfChat.map((date) => ({
      title: handleDate(date),
      item: userChat
        .filter((item) => {
          const date2 = new Date(item?.createdAt);
          return date2.toLocaleDateString().slice(0, 10) === date;
        })
        .reverse(),
    }));

    updateState({ result: newDataArr.reverse() });
  }, [userChat]);

  // Read the Messages that aren't been read
  useEffect(() => {
    if (unreadMessages.length > 0) {
      readMessages(token, chatId, unreadMessages);
    }
  }, [unreadMessages]);

  // Add message to the filtered chat
  const addMessage = (message) => {
    setState((state) => ({
      ...state,
      result: state.result.map((i) =>
        i.title === "Today"
          ? {
              title: "Today",
              item: [...i.item, message],
            }
          : i
      ),
    }));
  };

  // Send the message to the listener
  const sendMessage = () => {
    socket.emit("sendMsg", {
      chat_id: chatId,
      message: message,
    });
    updateState({ message: "" });
  };

  // Send image to the listener
  const sendImage = () => {
    socket.emit("sendMsg", {
      chat_id: chatId,
      message: imageUrl,
      mediaType: "image",
    });
    if (imageUrl) {
      setChatImageUrl("");
    }
    if (cameraPicUrl) {
      setCameraPicUrl("");
    }
  };

  // listen to the new messages and handle its
  useEffect(() => {
    socket.on(chatId, (data) => {
      addMessage(data);
      readUserChat(chatId);
    });

    return () => {
      socket.off(chatId);
    };
  }, [userChat]);

  // Select file from the device
  const selectFile = async () => {
    try {
      let res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      const type = res.uri.split(".")[res.uri.split(".").length - 1];
      uploadImage(token, {
        name: `${res.type}.${type}`,
        uri: res.uri,
        type: `application/${type}`,
      });
      updateState({ openFileSender: true });
    } catch (err) {
      showMessage({
        message: "Something Wrong",
        type: "warning",
        titleStyle: { fontWeight: "bold", fontSize: 16 },
      });
      console.log("Error in upload file : addScreen.js");
    }
  };

  // Access to camera and handle the photo
  const cameraPicUrl = useLocalData((state) => state.cameraPicUrl);
  const setCameraPicUrl = useLocalData((state) => state.setCameraPicUrl);
  const takePic = () => {
    updateState({ cameraOpen: true });
    navigation.push("LocalCamera");
  };

  useLayoutEffect(() => {
    if (cameraOpen && cameraPicUrl !== "") {
      const type = cameraPicUrl.split(".")[cameraPicUrl.split(".").length - 1];
      uploadImage(token, {
        name: `camera.${type}`,
        uri: cameraPicUrl,
        type: `application/${type}`,
      });
      updateState({
        cameraOpen: false,
        openFileSender: true,
      });
    }
  }, [cameraPicUrl]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
        <View style={{ flex: 1, position: "relative" }}>
          {chatListInfo()}
          {messageHandleInfo()}
        </View>
      </View>
      {openFileSender && FileSender()}
    </SafeAreaView>
  );

  function header() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 2.0,
          paddingBottom: Sizes.fixPadding,
          marginBottom: Sizes.fixPadding,
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
            size={22}
            onPress={() => navigation.goBack()}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            marginRight: Sizes.fixPadding * 2.0,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            source={
              !profilePic
                ? require("../../assets/images/icon.png")
                : { uri: profilePic }
            }
            style={{ width: 40.0, height: 40.0, borderRadius: 20 }}
          />
          <View style={{ marginLeft: Sizes.fixPadding + 5.0 }}>
            <Text style={{ ...Fonts.whiteColor16SemiBold }}>{name}</Text>
            <Text
              style={{
                marginTop: Sizes.fixPadding - 7.0,
                lineHeight: 15.0,
                ...Fonts.grayColor14Regular,
              }}
            >
              {name === "Admin"
                ? "Online"
                : onlineUser.includes(creatorId)
                ? "Online"
                : "Active recently"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  function chatListInfo() {
    const ImageText = ({ item, isUserMessage, messageTime }) => (
      <View
        style={{
          flexDirection: "row",
          justifyContent: isUserMessage ? "flex-end" : "flex-start",
        }}
      >
        <ImageBackground
          source={{ uri: item.text }}
          style={{
            marginVertical: Sizes.fixPadding,
            marginRight: isUserMessage ? Sizes.fixPadding * 1.5 : 0,
            marginLeft: isUserMessage ? 0 : Sizes.fixPadding,
            width: 150,
            height: 150,
            padding: 0,
            position: "relative",
          }}
        >
          <View
            style={{
              position: "absolute",
              right: 5,
              bottom: 1,
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                color: Colors.buttonTextColor,
                fontSize: 12,
              }}
            >
              {messageTime}
            </Text>
            {isUserMessage ? (
              <Ionicons
                name="checkmark-done"
                size={18}
                color={
                  item.status === "Read"
                    ? Colors.telegram
                    : Colors.buttonTextColor
                }
              />
            ) : null}
          </View>
        </ImageBackground>
      </View>
    );

    const TextMessage = ({ item, isUserMessage, messageTime }) => (
      <View
        style={{
          flexDirection: "row",
          justifyContent: isUserMessage ? "flex-end" : "flex-start",
          marginVertical: Sizes.fixPadding / 2,
          marginRight: isUserMessage ? Sizes.fixPadding * 1.5 : 0,
          marginLeft: isUserMessage ? 0 : Sizes.fixPadding,
        }}
      >
        <View
          style={{
            position: "relative",
            alignItems: "center",
            paddingHorizontal: Sizes.fixPadding,
            paddingVertical: Sizes.fixPadding * 0.5,
            borderRadius: Sizes.fixPadding * 0.5,
            marginLeft: 5,
            backgroundColor: isUserMessage ? "#005d4b" : "#212e36",
          }}
        >
          <Text
            style={{
              marginRight: isUserMessage ? 50 : 35,
              color: Colors.buttonTextColor,
            }}
          >
            {item.text}
          </Text>
          <View
            style={{
              position: "absolute",
              right: 5,
              bottom: 1,
              flexDirection: "row",
            }}
          >
            <Text
              style={{ fontSize: 12, color: Colors.grayColor, marginRight: 1 }}
            >
              {messageTime}
            </Text>
            {isUserMessage ? (
              <Ionicons
                name="checkmark-done"
                size={18}
                color={
                  item.status === "Read"
                    ? Colors.telegram
                    : Colors.buttonTextColor
                }
              />
            ) : null}
          </View>
        </View>
      </View>
    );

    const MessageItem = ({ item }) => {
      const date = moment(item.createdAt);
      const messageTime = date.format("HH:mm");
      const isUserMessage = userId === item.sender;
      return item.mediaType === "text" ? (
        <TextMessage
          item={item}
          isUserMessage={isUserMessage}
          messageTime={messageTime}
        />
      ) : (
        <ImageText
          item={item}
          isUserMessage={isUserMessage}
          messageTime={messageTime}
        />
      );
    };
    const renderItem = ({ item }) => {
      return (
        <View style={{ paddingVertical: Sizes.fixPadding }}>
          <View
            style={{
              justifyContent: "center",
              flexDirection: "row",
              marginBottom: 5,
            }}
          >
            <Text style={styles.messagesDateStyle}>{item.title}</Text>
          </View>
          <FlatList
            data={item.item}
            renderItem={(item) => MessageItem({ item: item.item })}
            keyExtractor={(item, index) => `${index}`}
          />
        </View>
      );
    };

    // set a Ref for the chat list
    const MessageListRef = useRef();

    return (
      <View style={{ marginBottom: 50 }}>
        <FlatList
          data={result}
          keyExtractor={(item, index) => `${index}`}
          renderItem={renderItem}
          ref={MessageListRef}
          onContentSizeChange={() =>
            MessageListRef.current.scrollToEnd({ animated: true })
          }
          onLayout={() =>
            MessageListRef.current.scrollToEnd({ animated: true })
          }
        />
      </View>
    );
  }

  function messageHandleInfo() {
    return (
      <View style={styles.messageHandleContainerStyle}>
        <View style={styles.inputContainerStyle}>
          <View style={{ flex: 1, paddingRight: Sizes.fixPadding }}>
            {messageInput()}
          </View>
          <TouchableOpacity
            activeOpacity={0.9}
            style={{ marginRight: Sizes.fixPadding }}
            onPress={() => selectFile()}
          >
            <Entypo name="attachment" size={24} color={Colors.grayColor} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.9} onPress={takePic}>
            <FontAwesome5 name="camera" size={24} color={Colors.grayColor} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.sendButtonStyle}
          onPress={message === "" ? null : sendMessage}
        >
          <Ionicons
            name="send-sharp"
            size={22.5}
            color={Colors.buttonTextColor}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function messageInput() {
    return (
      <TextInput
        value={message}
        onChangeText={(data) => updateState({ message: data })}
        placeholder="Message"
        placeholderTextColor={Colors.grayColor}
        style={{
          ...Fonts.whiteColor14Medium,
          flex: 1,
          marginLeft: Sizes.fixPadding + 2.0,
          fontSize: 20,
          fontWeight: "300",
        }}
        selectionColor={Colors.primaryColor}
        keyboardType="none"
      />
    );
  }

  function FileSender() {
    return (
      <View
        style={{
          backgroundColor: Colors.blackColor,
          width: screenWidth,
          height: screenHeight,
          position: "relative",
        }}
      >
        <Image
          style={{
            width: screenWidth,
            height: screenHeight * 0.5,
            position: "absolute",
            top: screenHeight * 0.2,
          }}
          source={{ uri: imageUrl ? imageUrl : "" }}
          resizeMode={"stretch"}
        />
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            ...styles.sendButtonStyle,
            position: "absolute",
            bottom: 100,
            right: 20,
          }}
          onPress={() => {
            sendImage();
            updateState({ openFileSender: false });
          }}
        >
          <Ionicons
            name="send-sharp"
            size={22.5}
            color={Colors.buttonTextColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            position: "absolute",
            top: 10,
            left: 20,
          }}
          onPress={() => updateState({ openFileSender: false, message: "" })}
        >
          <AntDesign name="close" size={24} color={Colors.whiteColor} />
        </TouchableOpacity>
      </View>
    );
  }
};

export default UserChatScreen;

function handleDate(text) {
  const date = new Date(text);
  // Today
  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);

  // yesterday
  const yesterday = new Date();
  yesterday.setDate(new Date().getDate() - 1);
  yesterday.setHours(0);
  yesterday.setMinutes(0);
  yesterday.setSeconds(0);

  // lsat week starting day
  const week = new Date();
  week.setDate(new Date().getDate() - 6);
  week.setHours(0);
  week.setMinutes(0);
  week.setSeconds(0);

  if (date.toLocaleDateString() === today.toLocaleDateString()) {
    return "Today";
  } else if (date.getTime() >= yesterday.getTime()) {
    return "Yesterday";
  } else if (date.getTime() >= week.getTime()) {
    const dayName = moment(text);
    return dayName.format("dddd");
  } else {
    const dayName = moment(text);
    return dayName.format("DD MMMM YYYY");
  }
}
