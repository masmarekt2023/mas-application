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
  Image,
} from "react-native";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  AntDesign,
} from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useController, useForm } from "react-hook-form";
import { showMessage } from "react-native-flash-message";
import useBundlesData from "../../../Data/useBundlesData";
import useLoginData from "../../../Data/useLoginData";
import useLocalData from "../../../Data/localData/useLocalData";
import * as ImagePicker from "expo-image-picker";

const EditBundle = ({ navigation, route }) => {
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
      borderColor: Colors.primaryColor,
    },
    textFieldStyle: {
      marginTop: Sizes.fixPadding,
      ...Fonts.whiteColor14Medium,
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
  });

  const {
    mediaUrl,
    bundleTitle,
    bundleName,
    details,
    donationAmount,
    coinName,
    duration,
    _id,
  } = route.params.bundleData;

  // get user token from the login data
  const token = useLoginData((state) => state.userInfo.token);

  // Yup inputs validation
  const schema = yup.object({
    file: yup.object({
      uri: yup.string().required("upload file please"),
    }),
    bundleTitle: yup.string().min(3, "Enter title please"),
    bundleName: yup.string().min(3, "Enter name please"),
    details: yup.string().min(3, "Enter description please"),
    duration: yup.string().required("Select a ending date"),
    donationAmount: yup
      .number()
      .positive("the price should be positive number"),
    coinName: yup.string().required("Enter coin name"),
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
      bundleId: _id,
      file: {
        uri: mediaUrl,
      },
      bundleTitle: bundleTitle,
      bundleName: bundleName,
      details: details,
      duration: duration,
      donationAmount: donationAmount,
      coinName: coinName,
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
        aspect: [4, 3],
        quality: 1,
      });
      const type = res.uri.split(".")[res.uri.split(".").length - 1];
      setValue("file", {
        name: `${res.type}.${type}`,
        uri: res.uri,
        type: `application/${type}`,
      });
    } catch (err) {
      showMessage({
        message: "Something Wrong",
        type: "warning",
        titleStyle: { fontWeight: "bold", fontSize: 16 },
      });
      console.log("Error in upload file : addScreen.js");
    }
  };

  // post the bundles data to the global state
  const editBundle = useBundlesData((state) => state.editBundle);

  const [state, setState] = useState({
    showCalender: false,
  });

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const { showCalender } = state;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {uploadFileInfo()}
          {titleInput({ name: "bundleTitle", control: control })}
          {nameInput({ name: "bundleName", control: control })}
          {descriptionInput({ name: "details", control: control })}
          {priceText({ name: "donationAmount", control: control })}
          {endingDateInfo()}
        </ScrollView>
      </View>
      {editButton()}
      {calender()}
    </SafeAreaView>
  );

  function editButton() {
    const onSubmit = handleSubmit(
      (data) => editBundle(token, data, navigation),
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
          Edit
        </Text>
      </TouchableOpacity>
    );
  }

  function endingDateInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0, opacity: 0.7 }}>
        <Text style={{ ...Fonts.whiteColor14Regular }}>Ending Date</Text>
        <TouchableOpacity activeOpacity={0.9} style={styles.dateInfoWrapStyle}>
          <Text style={{ ...Fonts.grayColor12Regular }}>
            {watch("duration")}
          </Text>
          <MaterialCommunityIcons
            name="calendar-month"
            size={22}
            color={Colors.grayColor}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function priceText({ name, control }) {
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
          <Text style={{ ...Fonts.whiteColor14Regular }}>Enter Price</Text>
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Enter Price"
            placeholderTextColor={Colors.grayColor}
            style={{
              ...styles.textFieldStyle,
              borderWidth: inputError ? 1 : 0,
              borderColor: Colors.errorColor,
              opacity: 0.6,
            }}
            selectionColor={Colors.primaryColor}
            keyboardType="number-pad"
            editable={false}
          />
        </View>
        {inputError ? (
          <Text
            style={{
              marginHorizontal: Sizes.fixPadding * 2.0,
              color: Colors.errorColor,
            }}
          >
            {inputError.message === "the price should be positive number"
              ? inputError.message
              : "Enter price"}
          </Text>
        ) : null}
      </>
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
            placeholder="Description of NFT"
            placeholderTextColor={Colors.grayColor}
            style={{
              ...styles.textFieldStyle,
              borderWidth: inputError ? 1 : 0,
              borderColor: Colors.errorColor,
              opacity: 0.6,
            }}
            selectionColor={Colors.primaryColor}
            multiline={true}
            numberOfLines={4}
            editable={false}
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

  function nameInput({ name, control }) {
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
          <Text style={{ ...Fonts.whiteColor14Regular }}>Name</Text>
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Name of your Bundle"
            placeholderTextColor={Colors.grayColor}
            style={{
              ...styles.textFieldStyle,
              borderWidth: inputError ? 1 : 0,
              borderColor: Colors.errorColor,
              opacity: 0.6,
            }}
            selectionColor={Colors.primaryColor}
            editable={false}
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
            placeholder="Title of your Bundle"
            placeholderTextColor={Colors.grayColor}
            style={{
              ...styles.textFieldStyle,
              borderWidth: inputError ? 1 : 0,
              borderColor: Colors.errorColor,
              opacity: 0.6,
            }}
            selectionColor={Colors.primaryColor}
            editable={false}
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
          <Image
            style={{ height: 250, width: 250 }}
            resizeMode={"stretch"}
            source={{ uri: watch("file").uri }}
          />
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setValue("file", { uri: "" })}
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

    return watch("file").uri !== "" ? (
      imageView
    ) : (
      <>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={selectFile}
          style={{
            ...styles.uploadFileInfoWrapStyle,
            borderColor: errors?.file ? Colors.errorColor : Colors.whiteColor,
          }}
        >
          <View style={styles.uploadIconWrapStyle}>
            <MaterialIcons
              name="cloud-upload"
              size={24}
              color={Colors.primaryColor}
            />
          </View>
          <Text style={{ ...Fonts.whiteColor14Regular }}>Upload your file</Text>
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
          Edit Bundle
        </Text>
      </View>
    );
  }

  function calender() {
    const hideDatePicker = () => {
      updateState({ showCalender: false });
    };

    const handleConfirm = (date) => {
      const nowDate = new Date();
      const days = (
        (date.getTime() - nowDate.getTime()) /
        (1000 * 60 * 60 * 24)
      ).toFixed(0);
      if (days > 7) {
        setValue("duration", `${days} Days`);
      } else {
        showMessage({
          message: "duration should be 7 days at least",
          type: "warning",
          titleStyle: { fontWeight: "bold", fontSize: 16 },
        });
      }
      hideDatePicker();
      //updateState({ endDate: `${date.getUTCDate()} ${monthsList[date.getUTCMonth()]}, ${date.getUTCFullYear()}` })
    };

    return (
      <DateTimePickerModal
        isVisible={showCalender}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    );
  }
};

export default EditBundle;
