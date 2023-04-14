import React, { useLayoutEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  TextInput,
  ImageBackground,
  Dimensions,
} from "react-native";
import {
  MaterialIcons,
  Entypo,
  MaterialCommunityIcons,
  Feather,
  AntDesign,
} from "@expo/vector-icons";
import { BottomSheet } from "@rneui/themed";
import useLoginData from "../../../Data/useLoginData";
import * as yup from "yup";
import { useController, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useProfileData from "../../../Data/useProfileData";
import useLocalData from "../../../Data/localData/useLocalData";
import * as ImagePicker from "expo-image-picker";
import { Camera, CameraType } from "expo-camera";
import { pageUrl } from "../../../Data/Apiconfigs";

const screenWidth = Dimensions.get("window").width;

const convertToFileType = (uri, name) => {
  if (uri !== "") {
    const type = uri.split(".")[uri.split(".").length - 1];
    return {
      name: `${name}.${type}`,
      uri: uri,
      type: `application/${type}`,
    };
  } else {
    return { uri: "" };
  }
};

const EditProfileScreen = ({ navigation }) => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes } = useLocalData((state) => state.styles);

  // The style Object
  const styles = StyleSheet.create({
    backArrowWrapStyle: {
      width: 40.0,
      height: 40.0,
      borderRadius: 20.0,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.tabIconBgColor,
    },
    cameraIconWrapStyle: {
      backgroundColor: Colors.primaryColor,
      width: 30.0,
      height: 30.0,
      borderRadius: 15.0,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      bottom: 0.0,
      right: 0.0,
    },
    profilePicWithChangeOptionWrapStyle: {
      marginBottom: Sizes.fixPadding * 3.0,
      marginTop: Sizes.fixPadding,
      alignItems: "center",
      alignSelf: "center",
    },
    textFieldStyle: {
      backgroundColor: Colors.inputBgColor,
      borderRadius: Sizes.fixPadding - 5.0,
      paddingHorizontal: Sizes.fixPadding + 2.0,
      paddingVertical: Sizes.fixPadding + 5.0,
      ...Fonts.whiteColor14Medium,
      color: Colors.inputTextColor,
      marginTop: Sizes.fixPadding,
    },
    updateButtonStyle: {
      backgroundColor: Colors.primaryColor,
      paddingVertical: Sizes.fixPadding + 5.0,
      alignItems: "center",
      justifyContent: "center",
      margin: Sizes.fixPadding * 2.0,
      borderRadius: Sizes.fixPadding - 5.0,
    },
    changeProfilePicBottomSheetStyle: {
      backgroundColor: Colors.bodyBackColor,
      paddingHorizontal: Sizes.fixPadding * 2.0,
      paddingTop: Sizes.fixPadding + 10.0,
      borderTopLeftRadius: Sizes.fixPadding * 3.0,
      borderTopRightRadius: Sizes.fixPadding * 3.0,
    },
    changeProfilePicOptionsIconWrapStyle: {
      width: 40.0,
      height: 40.0,
      borderRadius: 20.0,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  // get user token from the login data
  const token = useLoginData((state) => state.userInfo.token);

  // fetch the update for the profile data
  const updateProfile = useProfileData((state) => state.updateProfile);

  // Get profile data from global state
  const {
    name,
    email,
    emailVerification,
    phone,
    phoneVerification,
    imageCover,
    userImage,
    userName,
    description,
    facebook,
    telegram,
    twitter,
    youtube,
    walletAddress,
    referralCode,
    bio,
  } = useProfileData((state) => state.userData);

  // Yup inputs validation
  const schema = yup.object({
    name: yup.string().min(3, "Enter name please"),
    facebook: yup.string().url("Invalid url"),
    twitter: yup.string().url("Invalid url"),
    youtube: yup.string().url("Invalid url"),
    telegram: yup.string().url("Invalid url"),
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
      name: name,
      speciality: description,
      coverPic: convertToFileType(imageCover, `${userName}-coverPic`),
      profilePic: convertToFileType(userImage, `${userName}-profilePic`),
      bio: bio ? bio : "",
      facebook: facebook ? facebook : "",
      twitter: twitter ? twitter : "",
      youtube: youtube ? youtube : "",
      telegram: telegram ? telegram : "",
    },
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
  });

  // copy wallet address to Clipboard
  const copyToClipboard = useLocalData((state) => state.copyToClipboard);

  // Handle variables
  const [state, setState] = useState({
    showBottomSheet: false,
    selectedName: "",
    type: CameraType.back,
    permission: Camera.useCameraPermissions(),
  });

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const { showBottomSheet, selectedName } = state;

  // Select File From device
  const selectFile = async () => {
    try {
      let res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true
      });
      const type = res.uri.split(".")[res.uri.split(".").length - 1];
      setValue(selectedName, {
        name: `${res.type}.${type}`,
        uri: res.uri,
        type: `application/${type}`,
      });
      updateState({ showBottomSheet: false, selectedName: "" });
    } catch (err) {
      console.log("Error in upload file : addScreen.js");
    }
  };

  // Access to camera and handle the photo
  const cameraPicUrl = useLocalData((state) => state.cameraPicUrl);
  const takePic = () => {
    updateState({ showBottomSheet: false });
    navigation.push("LocalCamera");
  };

  useLayoutEffect(() => {
    if (selectedName !== "") {
      setValue(selectedName, convertToFileType(cameraPicUrl, "camera"));
      updateState({ selectedName: "" });
    }
  }, [cameraPicUrl]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {profilePicWithChangeOption()}
          {fullNameInfo({ name: "name", control: control })}
          {specialityInfo({ name: "speciality", control: control })}
          {bioInfo({ name: "bio", control: control })}
          {emailAddressInfo()}
          {phoneNumberInfo()}
          {profileURLInfo()}
          {walletAddressInfo()}
          {referralCodeInfo()}
          {SocialMediaInfo({ control: control })}
        </ScrollView>
      </View>
      {updateButton()}
      {changeProfilePicOptionsSheet()}
    </SafeAreaView>
  );

  function changeProfilePicOptionsSheet() {
    return (
      <BottomSheet
        isVisible={showBottomSheet}
        containerStyle={{ backgroundColor: "rgba(0.5, 0.50, 0, 0.50)" }}
        onBackdropPress={() => updateState({ showBottomSheet: false })}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => updateState({ showBottomSheet: false })}
          style={styles.changeProfilePicBottomSheetStyle}
        >
          <Text style={{ textAlign: "center", ...Fonts.whiteColor20SemiBold }}>
            Choose Option
          </Text>
          <View
            style={{
              marginTop: Sizes.fixPadding + 10.0,
              marginBottom: Sizes.fixPadding,
            }}
          >
            {changeProfilePicOptionsSort({
              bgColor: "#009688",
              icon: (
                <Entypo
                  name="camera"
                  size={18}
                  color={Colors.buttonTextColor}
                />
              ),
              option: "Camera",
            })}
            {changeProfilePicOptionsSort({
              bgColor: "#00A7F7",
              icon: (
                <MaterialCommunityIcons
                  name="image"
                  size={20}
                  color={Colors.buttonTextColor}
                />
              ),
              option: "Gallery",
            })}
            {changeProfilePicOptionsSort({
              bgColor: "#DD5A5A",
              icon: (
                <Feather
                  name="trash-2"
                  size={20}
                  color={Colors.buttonTextColor}
                />
              ),
              option: `Remove photo`,
            })}
          </View>
        </TouchableOpacity>
      </BottomSheet>
    );
  }

  function changeProfilePicOptionsSort({ bgColor, icon, option }) {
    const removeEvent = () => {
      setValue(selectedName, { uri: "" });
      updateState({ showBottomSheet: false, selectedName: "" });
    };
    const onPress = () => {
      option === "Remove photo" ? removeEvent() : null;
      option === "Camera" ? takePic() : null;
      option === "Gallery" ? selectFile() : null;
    };
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: Sizes.fixPadding * 2.0,
        }}
      >
        <View
          style={{
            ...styles.changeProfilePicOptionsIconWrapStyle,
            backgroundColor: bgColor,
          }}
        >
          {icon}
        </View>
        <Text
          style={{
            marginLeft: Sizes.fixPadding + 5.0,
            ...Fonts.whiteColor14Medium,
          }}
        >
          {option}
        </Text>
      </TouchableOpacity>
    );
  }

  function updateButton() {
    const onSubmit = handleSubmit(
      (data) => updateProfile(token, data, navigation),
      () => console.log(errors)
    );
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onSubmit}
        style={styles.updateButtonStyle}
      >
        <Text
          style={{
            ...Fonts.whiteColor20SemiBold,
            color: Colors.buttonTextColor,
          }}
        >
          Update
        </Text>
      </TouchableOpacity>
    );
  }

  function walletAddressInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0, marginTop: 0 }}>
        <Text style={{ ...Fonts.grayColor12Regular }}>Wallet Address</Text>
        <View
          style={{
            backgroundColor: Colors.inputBgColor,
            borderRadius: Sizes.fixPadding - 5.0,
            paddingHorizontal: Sizes.fixPadding + 2.0,
            paddingVertical: Sizes.fixPadding + 5.0,
            marginTop: Sizes.fixPadding,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              ...Fonts.whiteColor14Medium,
              color: Colors.inputTextColor,
              width: screenWidth * 0.7,
            }}
          >
            {walletAddress}
          </Text>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => copyToClipboard(walletAddress)}
          >
            <MaterialCommunityIcons
              name={"content-copy"}
              size={18}
              color={Colors.primaryColor}
              style={{ marginLeft: Sizes.fixPadding }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function referralCodeInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0, marginTop: 0 }}>
        <Text style={{ ...Fonts.grayColor12Regular }}>Referral Code</Text>
        <View
          style={{
            backgroundColor: Colors.inputBgColor,
            borderRadius: Sizes.fixPadding - 5.0,
            paddingHorizontal: Sizes.fixPadding + 2.0,
            paddingVertical: Sizes.fixPadding + 5.0,
            marginTop: Sizes.fixPadding,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              ...Fonts.whiteColor14Medium,
              color: Colors.inputTextColor,
              width: screenWidth * 0.7,
            }}
          >
            {referralCode}
          </Text>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => copyToClipboard(referralCode)}
          >
            <MaterialCommunityIcons
              name={"content-copy"}
              size={18}
              color={Colors.primaryColor}
              style={{ marginLeft: Sizes.fixPadding }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function SocialMediaInfo({ control }) {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0, marginTop: 0 }}>
        <Text style={{ ...Fonts.whiteColor16SemiBold }}>Social Accounts</Text>
        {accountInput({ name: "telegram", control: control })}
        {accountInput({ name: "facebook", control: control })}
        {accountInput({ name: "youtube", control: control })}
        {accountInput({ name: "twitter", control: control })}
      </View>
    );
  }

  function accountInput({ name, control }) {
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
          <Text style={{ ...Fonts.grayColor12Regular }}>{`${name
            .charAt(0)
            .toUpperCase()}${name.slice(1)}`}</Text>
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            placeholder={`Enter your ${name} account`}
            placeholderTextColor={Colors.inputTextColor}
            selectionColor={Colors.primaryColor}
            style={{
              ...styles.textFieldStyle,
              borderWidth: inputError ? 1 : 0,
              borderColor: Colors.errorColor,
            }}
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

  function profileURLInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0, marginTop: 0 }}>
        <Text style={{ ...Fonts.grayColor12Regular }}>Profile URL</Text>
        <View
          style={{
            backgroundColor: Colors.inputBgColor,
            borderRadius: Sizes.fixPadding - 5.0,
            paddingHorizontal: Sizes.fixPadding + 2.0,
            paddingVertical: Sizes.fixPadding + 5.0,
            marginTop: Sizes.fixPadding,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              ...Fonts.whiteColor14Medium,
              color: Colors.inputTextColor,
            }}
          >
            {pageUrl}/user-profile/{userName}
          </Text>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              copyToClipboard(
                `https://masplatform.net/user-profile/${userName}`
              )
            }
          >
            <MaterialCommunityIcons
              name={"content-copy"}
              size={18}
              color={Colors.primaryColor}
              style={{ marginLeft: Sizes.fixPadding }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function phoneNumberInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0, marginTop: 0 }}>
        <Text style={{ ...Fonts.grayColor12Regular }}>Phone Number</Text>
        <View
          style={{
            backgroundColor: Colors.inputBgColor,
            borderRadius: Sizes.fixPadding - 5.0,
            paddingHorizontal: Sizes.fixPadding + 2.0,
            paddingVertical: Sizes.fixPadding + 5.0,
            marginTop: Sizes.fixPadding,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              ...Fonts.whiteColor14Medium,
              color: Colors.inputTextColor,
            }}
            selectable={true}
          >
            {phone}
          </Text>
          <AntDesign
            name={phoneVerification ? "checkcircleo" : "closecircleo"}
            size={24}
            color={phoneVerification ? Colors.greenColor : Colors.errorColor}
          />
        </View>
        {!phoneVerification && (
          <TouchableOpacity
            activeOpacity={0.9}
            style={{ marginTop: Sizes.fixPadding * 0.5 }}
            onPress={() =>
              navigation.push("Verification", {
                token: token,
                channel: "sms",
                context: "verifyLater",
              })
            }
          >
            <Text style={Fonts.primaryColor14SemiBold}>Send Code to verification phone number</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  function emailAddressInfo() {
    return (
      <View
        style={{ margin: Sizes.fixPadding * 2.0, marginTop: Sizes.fixPadding }}
      >
        <Text style={{ ...Fonts.grayColor12Regular }}>Email Address</Text>
        <View
          style={{
            backgroundColor: Colors.inputBgColor,
            borderRadius: Sizes.fixPadding - 5.0,
            paddingHorizontal: Sizes.fixPadding + 2.0,
            paddingVertical: Sizes.fixPadding + 5.0,
            marginTop: Sizes.fixPadding,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              ...Fonts.whiteColor14Medium,
              color: Colors.inputTextColor,
            }}
            selectable={true}
          >
            {email}
          </Text>
          <AntDesign
            name={emailVerification ? "checkcircleo" : "closecircleo"}
            size={24}
            color={emailVerification ? Colors.greenColor : Colors.errorColor}
          />
        </View>
        {!emailVerification && (
          <TouchableOpacity
            activeOpacity={0.9}
            style={{ marginTop: Sizes.fixPadding * 0.5 }}
            onPress={() =>
              navigation.push("Verification", {
                token: token,
                channel: "email",
                context: "verifyLater",
              })
            }
          >
            <Text style={Fonts.primaryColor14SemiBold}>Send Code to verification email</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  function bioInfo({ name, control }) {
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
          <Text style={{ ...Fonts.grayColor12Regular }}>About Me</Text>
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            placeholder="About Me"
            placeholderTextColor={Colors.inputTextColor}
            selectionColor={Colors.primaryColor}
            style={{
              ...styles.textFieldStyle,
              borderWidth: inputError ? 1 : 0,
              borderColor: Colors.errorColor,
            }}
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

  function specialityInfo({ name, control }) {
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
          <Text style={{ ...Fonts.grayColor12Regular }}>Speciality</Text>
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Enter Speciality"
            placeholderTextColor={Colors.inputTextColor}
            selectionColor={Colors.primaryColor}
            style={{
              ...styles.textFieldStyle,
              borderWidth: inputError ? 1 : 0,
              borderColor: Colors.errorColor,
            }}
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

  function fullNameInfo({ name, control }) {
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
          <Text style={{ ...Fonts.grayColor12Regular }}>Full Name</Text>
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Enter Name"
            placeholderTextColor={Colors.inputTextColor}
            selectionColor={Colors.primaryColor}
            style={{
              ...styles.textFieldStyle,
              borderWidth: inputError ? 1 : 0,
              borderColor: Colors.errorColor,
            }}
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

  function profilePicWithChangeOption() {
    return (
      <ImageBackground
        source={
          watch("coverPic").uri === ""
            ? require("../../../assets/images/icon.png")
            : { uri: watch("coverPic").uri }
        }
        style={{ marginBottom: 10 }}
        resizeMode={"stretch"}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            updateState({ showBottomSheet: true, selectedName: "coverPic" })
          }
          style={{ ...styles.cameraIconWrapStyle, right: 10, bottom: 10 }}
        >
          <MaterialIcons
            name="photo-camera"
            size={15}
            color={Colors.buttonTextColor}
          />
        </TouchableOpacity>
        <View style={styles.profilePicWithChangeOptionWrapStyle}>
          <Image
            source={
              watch("profilePic").uri === ""
                ? require("../../../assets/images/icon.png")
                : { uri: watch("profilePic").uri }
            }
            style={{ width: 100.0, height: 100.0, borderRadius: 50.0 }}
          />
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              updateState({ showBottomSheet: true, selectedName: "profilePic" })
            }
            style={styles.cameraIconWrapStyle}
          >
            <MaterialIcons
              name="photo-camera"
              size={15}
              color={Colors.buttonTextColor}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
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
            onPress={() => navigation.pop()}
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
          Edit Profile
        </Text>
      </View>
    );
  }
};

export default EditProfileScreen;
