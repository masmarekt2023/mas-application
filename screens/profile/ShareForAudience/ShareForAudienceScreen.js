import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  StatusBar,
  ScrollView,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useController, useForm } from "react-hook-form";
import useBundlesData from "../../../Data/useBundlesData";
import useLoginData from "../../../Data/useLoginData";
import moment from "moment/moment";
import useLocalData from "../../../Data/localData/useLocalData";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import UploadCounterDialog from "../../../components/UploadCounterDialog";

const screenWidth = Dimensions.get("window").width;

const ShareForAudienceScreen = ({ navigation, route }) => {
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
    uploadFileInfoWrapStyle: {
      backgroundColor: Colors.inputBgColor,
      borderRadius: Sizes.fixPadding + 5.0,
      borderStyle: "dashed",
      borderColor: Colors.whiteColor,
      borderWidth: 1.0,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: Sizes.fixPadding * 4.0,
      marginHorizontal: Sizes.fixPadding * 2.0,
    },
    uploadIconWrapStyle: {
      width: 60.0,
      height: 60.0,
      borderRadius: 30.0,
      backgroundColor: Colors.inputBgColor,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: Sizes.fixPadding + 5.0,
      borderWidth: 1,
      borderColor: Colors.inputTextColor,
    },
    textFieldStyle: {
      marginTop: Sizes.fixPadding,
      ...Fonts.whiteColor14Medium,
      color: Colors.inputTextColor,
      backgroundColor: Colors.inputBgColor,
      paddingHorizontal: Sizes.fixPadding,
      paddingVertical: Sizes.fixPadding + 5.0,
      borderRadius: Sizes.fixPadding - 5.0,
    },
    continueButtonStyle: {
      backgroundColor: Colors.primaryColor,
      paddingVertical: Sizes.fixPadding + 5.0,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: Sizes.fixPadding - 5.0,
      margin: Sizes.fixPadding * 2.0,
    },
    dateInfoWrapStyle: {
      marginTop: Sizes.fixPadding,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: Colors.inputBgColor,
      paddingHorizontal: Sizes.fixPadding,
      paddingVertical: Sizes.fixPadding + 8.0,
      borderRadius: Sizes.fixPadding - 5.0,
    },
    bidInfoWrapStyle: {
      marginBottom: Sizes.fixPadding * 3.0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
  });

  const item = route.params?.item;
  const isEdit = !!item;

  // Get user token from the login data
  const token = useLoginData((state) => state.userInfo.token);

  // Get all user bundles from the global state
  const userBundles = useBundlesData((state) => state.myBundlesList);

  // Upload the data to database
  const shareForAudience = useBundlesData((state) => state.shareForAudience);

  // Edit audience and Upload the data to database
  const editAudience = useBundlesData((state) => state.editAudience);

  const [mediaUrl, setMediaUrl] = useState(
    item?.mediaUrl ? item?.mediaUrl : ""
  );

  const [uploadCounter, setUploadCounter] = useState(0);

  // Yup inputs validation
  const schema = yup.object({
    file: yup.object({
      uri: isEdit ? null : yup.string().required("upload file please"),
    }),
    title: yup.string().min(3, "Enter title please"),
    details: yup.string().min(3, "Enter description please"),
  });

  // React-Hook-form for handling the form's inputs
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      file: { uri: "" },
      title: isEdit ? item.title : "",
      details: isEdit ? item.details : "",
      type: isEdit ? item.postType : "PUBLIC",
      bundleIds: isEdit ? item.nftId : [userBundles[0]?._id],
    },
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
  });

  // Select File
  const selectFile = async () => {
    try {
      let res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
      });
      const type = res.uri.split(".")[res.uri.split(".").length - 1];
      setValue("file", {
        name: `${res.type}.${type}`,
        uri: res.uri,
        type: `application/${type}`,
      });
      setMediaUrl(res.uri);
    } catch (err) {
      console.log("Error in upload file : addScreen.js");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {uploadFileInfo()}
          {titleInput({ name: "title", control: control })}
          {descriptionInput({ name: "details", control: control })}
          {typeInfo()}
          {bundlesInfo()}
        </ScrollView>
      </View>
      {shareButton()}
      <UploadCounterDialog counter={uploadCounter} />
    </SafeAreaView>
  );

  function shareButton() {
    const changeUploadCounter = (value) => setUploadCounter(value);
    const onSubmit = handleSubmit(
      (data) =>
        isEdit
          ? editAudience(
              token,
              {
                details: data.details,
                id: item._id,
                postType: data.type,
                file: data.file?.type ? data.file : null,
              },
              navigation,
                setUploadCounter
            )
          : shareForAudience(token, data, navigation, changeUploadCounter),
      () => console.log(errors)
    );
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onSubmit}
        style={styles.continueButtonStyle}
      >
        <Text
          style={{
            ...Fonts.whiteColor20SemiBold,
            color: Colors.buttonTextColor,
          }}
        >
          {isEdit ? "Edit" : "Share"}
        </Text>
      </TouchableOpacity>
    );
  }

  function bundlesInfo() {
    const renderItem = ({ item }) => {
      const date = moment(item.createdAt);
      const formatDate = `${date.format("MMM DD,YYYY")} at ${date.format(
        "LT"
      )}`;
      const bundlesIds = watch("bundleIds");
      const isCheck = bundlesIds.includes(item._id);

      const onPress = () => {
        if (isCheck) {
          setValue(
            "bundleIds",
            bundlesIds.filter((i) => i !== item._id)
          );
        } else {
          setValue("bundleIds", [...bundlesIds, item._id]);
        }
      };

      return (
        <TouchableOpacity
          activeOpacity={0.9}
          style={{ ...styles.bidInfoWrapStyle, marginTop: Sizes.fixPadding }}
          onPress={isEdit ? null : onPress}
        >
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <Image
              source={
                item.mediaUrl
                  ? { uri: item.mediaUrl }
                  : require("../../../assets/images/icon.png")
              }
              style={{ width: 55.0, height: 55.0, borderRadius: 27.5 }}
            />
            <View style={{ flex: 1, marginLeft: Sizes.fixPadding + 5.0 }}>
              <Text style={{ ...Fonts.whiteColor16Medium }}>
                {item.bundleTitle}
              </Text>
              <Text style={{ lineHeight: 15.0, ...Fonts.grayColor13Regular }}>
                {formatDate}
              </Text>
            </View>
          </View>
          {isCheck ? (
            <AntDesign
              name={"checkcircleo"}
              size={24}
              color={Colors.greenColor}
            />
          ) : null}
        </TouchableOpacity>
      );
    };

    return (
      <View
        style={{
          marginTop: Sizes.fixPadding * 2.0,
          marginHorizontal: Sizes.fixPadding * 2.0,
        }}
      >
        <Text style={{ ...Fonts.whiteColor14Regular }}>
          Bundle To Share with
        </Text>
        <FlatList
          data={userBundles}
          keyExtractor={(item) => `${item._id}`}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      </View>
    );
  }

  function typeInfo() {
    return (
      <View
        style={{
          marginTop: Sizes.fixPadding,
          marginHorizontal: Sizes.fixPadding * 2.0,
        }}
      >
        <Text style={{ ...Fonts.whiteColor14Regular }}>Type</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: Sizes.fixPadding,
          }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: Sizes.fixPadding,
              width: screenWidth * 0.3,
              flexDirection: "row",
              justifyContent: "center",
              backgroundColor:
                watch("type") === "PUBLIC"
                  ? Colors.primaryColor
                  : Colors.bodyBackColor,
              borderWidth: watch("type") === "PUBLIC" ? 0 : 1,
              borderColor: Colors.whiteColor,
            }}
            activeOpacity={0.9}
            onPress={() => setValue("type", "PUBLIC")}
          >
            <Text
              style={{
                ...Fonts.whiteColor14SemiBold,
                color:
                  watch("type") === "PUBLIC"
                    ? Colors.buttonTextColor
                    : Colors.whiteColor,
              }}
            >
              Public
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingVertical: Sizes.fixPadding,
              width: screenWidth * 0.3,
              flexDirection: "row",
              justifyContent: "center",
              backgroundColor:
                watch("type") === "PRIVATE"
                  ? Colors.primaryColor
                  : Colors.bodyBackColor,
              borderWidth: watch("type") === "PRIVATE" ? 0 : 1,
              borderColor: Colors.whiteColor,
            }}
            activeOpacity={0.9}
            onPress={() => setValue("type", "PRIVATE")}
          >
            <Text
              style={{
                ...Fonts.whiteColor14SemiBold,
                color:
                  watch("type") === "PRIVATE"
                    ? Colors.buttonTextColor
                    : Colors.whiteColor,
              }}
            >
              Private
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function descriptionInput({ name, control }) {
    // Use Controller from React-Hook-Form to handle the field
    const { field } = useController({
      control,
      name,
    });
    const inputError = errors?.[`${name}`];
    return (
      <>
        <View
          style={{
            marginTop: Sizes.fixPadding,
            marginHorizontal: Sizes.fixPadding * 2.0,
            marginBottom: inputError ? Sizes.fixPadding / 2 : 0,
          }}
        >
          <Text style={{ ...Fonts.whiteColor14Regular }}>Description</Text>
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Enter Description"
            placeholderTextColor={Colors.inputTextColor}
            style={{
              ...styles.textFieldStyle,
              borderWidth: inputError ? 1 : 0,
              borderColor: Colors.errorColor,
            }}
            selectionColor={Colors.primaryColor}
            multiline={true}
            numberOfLines={4}
          />
        </View>
        {inputError ? (
          <Text
            style={{
              marginHorizontal: Sizes.fixPadding * 2.0,
              color: Colors.errorColor,
            }}
          >
            {inputError.message}
          </Text>
        ) : null}
      </>
    );
  }

  function titleInput({ name, control }) {
    // Use Controller from React-Hook-Form to handle the field
    const { field } = useController({
      control,
      name,
    });
    const inputError = errors?.[`${name}`];
    return (
      <>
        <View
          style={{
            marginTop: Sizes.fixPadding * 2.0,
            marginHorizontal: Sizes.fixPadding * 2.0,
            marginBottom: inputError ? Sizes.fixPadding / 2 : 0,
          }}
        >
          <Text style={{ ...Fonts.whiteColor14Regular }}>Title</Text>
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Enter Title"
            placeholderTextColor={Colors.inputTextColor}
            style={{
              ...styles.textFieldStyle,
              borderWidth: inputError ? 1 : 0,
              borderColor: Colors.errorColor,
            }}
            selectionColor={Colors.primaryColor}
            editable={!isEdit}
          />
        </View>
        {inputError ? (
          <Text
            style={{
              marginHorizontal: Sizes.fixPadding * 2.0,
              color: Colors.errorColor,
            }}
          >
            {inputError.message}
          </Text>
        ) : null}
      </>
    );
  }

  function uploadFileInfo() {
    const imageView = (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          alignItems: "center",
          paddingTop: Sizes.fixPadding * 3.0,
        }}
      >
        <View style={{ position: "relative" }}>
          {isVideo(mediaUrl) ? (
            BundleVideo(mediaUrl)
          ) : (
            <Image
              style={{ height: 250, width: 250 }}
              resizeMode={"stretch"}
              source={{ uri: mediaUrl }}
            />
          )}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              setValue("file", { uri: "" });
              setMediaUrl("");
            }}
            style={{
              width: 35,
              height: 35,
              borderRadius: 17.5,
              backgroundColor: Colors.primaryColor,
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: -17.5,
              right: -17.5,
            }}
          >
            <AntDesign name="close" size={24} color={"#ffffff"} />
          </TouchableOpacity>
        </View>
      </View>
    );

    return mediaUrl !== "" ? (
      imageView
    ) : (
      <>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={selectFile}
          style={{
            ...styles.uploadFileInfoWrapStyle,
            borderColor: errors?.file
              ? Colors.errorColor
              : Colors.buttonTextColor,
          }}
        >
          <View style={styles.uploadIconWrapStyle}>
            <MaterialIcons
              name="cloud-upload"
              size={24}
              color={Colors.buttonTextColor}
            />
          </View>
          <Text
            style={{
              ...Fonts.whiteColor14Regular,
              color: Colors.inputTextColor,
            }}
          >
            Upload your file
          </Text>
          <Text
            style={{
              marginTop: Sizes.fixPadding - 7.0,
              ...Fonts.grayColor12Regular,
            }}
          >
            ( Image, MP4)
          </Text>
        </TouchableOpacity>
        {errors?.file ? (
          <Text
            style={{
              marginHorizontal: Sizes.fixPadding * 2.0,
              marginTop: Sizes.fixPadding,
              color: Colors.errorColor,
            }}
          >
            {errors?.file?.uri.message}
          </Text>
        ) : null}
      </>
    );
  }

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
          Share For Audience
        </Text>
      </View>
    );
  }

  function BundleVideo(uri) {
    return (
      <Video
        source={{ uri }}
        style={{ height: 250, width: 250 }}
        shouldPlay
        useNativeControls
        resizeMode={"stretch"}
      />
    );
  }

  function isVideo(uri) {
    const videoFormats = ["mp4", "avi", "mkv", "mov", "wmv", "flv", "webm"];
    const urlFormat = uri.split(".")[uri.split(".").length - 1];
    return videoFormats.includes(urlFormat);
  }
};
export default ShareForAudienceScreen;
