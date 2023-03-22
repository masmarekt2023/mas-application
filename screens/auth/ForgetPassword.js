import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { useController, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import useForgetPasswordData from "../../Data/useForgetPasswordData";
import Loading from "../../components/Loading";
import useLocalData from "../../Data/localData/useLocalData";

const ForgetPassword = ({ navigation }) => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes } = useLocalData((state) => state.styles);

  // The style Object
  const styles = StyleSheet.create({
    backArrowWrapStyle: {
      width: 40.0,
      height: 40.0,
      borderRadius: 20.0,
      backgroundColor: Colors.inputBgColor,
      alignItems: "center",
      justifyContent: "center",
    },
    continueButtonStyle: {
      backgroundColor: Colors.primaryColor,
      paddingVertical: Sizes.fixPadding + 5.0,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: Sizes.fixPadding - 5.0,
      margin: Sizes.fixPadding * 2.0,
    },
    textFieldWrapStyle: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors.inputBgColor,
      borderRadius: Sizes.fixPadding - 5.0,
      paddingHorizontal: Sizes.fixPadding + 2.0,
      paddingVertical: Sizes.fixPadding + 5.0,
      marginHorizontal: Sizes.fixPadding * 2.0,
    },
  });

  // Yup Validation
  const schema = yup.object({
    email: yup.string().required("Enter your email").email("Incorrect Email"),
  });

  // React-Hook-form for handling the form's inputs
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
  });

  // Fetch the api from the Api
  const sendCode = useForgetPasswordData((state) => state.sendCode);
  const isLoading = useForgetPasswordData((state) => state.isLoading);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {emailTextField({ name: "email", control: control })}
        </ScrollView>
      </View>
      {continueButton()}
      {Loading({ isLoading: isLoading })}
    </SafeAreaView>
  );

  function continueButton() {
    const onSubmit = handleSubmit(
      (data) => sendCode(data, navigation, "ResetPassword"),
      () => console.log(errors)
    );
    return (
      <TouchableOpacity
        disabled={!!Object.keys(errors).length}
        activeOpacity={0.9}
        onPress={onSubmit}
        style={{
          ...styles.continueButtonStyle,
          opacity: Object.keys(errors).length ? 0.7 : 1,
        }}
      >
        <Text style={{ ...Fonts.whiteColor20SemiBold, color: "#fff" }}>
          Continue
        </Text>
      </TouchableOpacity>
    );
  }

  function emailTextField({ name, control }) {
    // Use Controller from React-Hook-Form to handle the field
    const { field } = useController({
      name,
      control,
    });
    return (
      <>
        <View
          style={{
            ...styles.textFieldWrapStyle,
            marginBottom: errors?.email ? 0 : Sizes.fixPadding * 2.0,
            borderWidth: errors?.email ? 1 : 0,
            borderColor: Colors.errorColor,
          }}
        >
          <MaterialIcons name="email" size={20} color={Colors.whiteColor} />
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Enter Email"
            placeholderTextColor={Colors.grayColor}
            style={{
              ...Fonts.whiteColor14Medium,
              flex: 1,
              marginLeft: Sizes.fixPadding + 2.0,
            }}
            selectionColor={Colors.primaryColor}
            keyboardType="email-address"
          />
        </View>
        {errors?.email ? (
          <Text
            style={{
              marginHorizontal: Sizes.fixPadding * 2.0,
              marginBottom: Sizes.fixPadding * 2.0,
              marginTop: Sizes.fixPadding,
              color: Colors.errorColor,
            }}
          >
            {errors?.email.message}
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
            color={Colors.whiteColor}
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
          Forgot Password
        </Text>
      </View>
    );
  }
};
export default ForgetPassword;
