import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  StatusBar,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  MaterialIcons,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import IntlPhoneInput from "react-native-intl-phone-input";
import YupPassword from "yup-password";
import * as yup from "yup";
import { useController, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import useSignUpData from "../../Data/useSignUpData";
import Loading from "../../components/Loading";
import useLocalData from "../../Data/localData/useLocalData";

const RegisterScreen = ({ navigation }) => {
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
    textFieldWrapStyle: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors.inputBgColor,
      borderRadius: Sizes.fixPadding - 5.0,
      paddingHorizontal: Sizes.fixPadding + 2.0,
      paddingVertical: Sizes.fixPadding + 5.0,
      marginHorizontal: Sizes.fixPadding * 2.0,
    },
    forgetPasswordTextStyle: {
      marginTop: Sizes.fixPadding - 5.0,
      marginHorizontal: Sizes.fixPadding * 2.0,
      textAlign: "right",
      ...Fonts.primaryColor14Medium,
    },
    signupButtonStyle: {
      backgroundColor: Colors.primaryColor,
      paddingVertical: Sizes.fixPadding + 5.0,
      alignItems: "center",
      justifyContent: "center",
      marginVertical: Sizes.fixPadding * 4.0,
      marginHorizontal: Sizes.fixPadding * 2.0,
      borderRadius: Sizes.fixPadding - 5.0,
    },
    googleAndFacebookButtonWrapStyle: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255,255,255,0.05)",
      paddingVertical: Sizes.fixPadding + 5.0,
      marginHorizontal: Sizes.fixPadding,
      borderRadius: Sizes.fixPadding - 5.0,
    },
    checkBoxStyle: {
      width: 18.0,
      height: 18.0,
      borderRadius: Sizes.fixPadding - 8.0,
      borderWidth: 1.0,
      alignItems: "center",
      justifyContent: "center",
    },
    agreeOrNotInfoWrapStyle: {
      marginTop: Sizes.fixPadding,
      marginHorizontal: Sizes.fixPadding * 2.0,
      flexDirection: "row",
      alignItems: "center",
    },
  });

  // Yup inputs validation
  const [phoneNumberLength, setPhoneNumberLength] = useState(13);
  YupPassword(yup);
  const passwordErrorMessage =
    "Password must contain at least 8 characters, one uppercase and one number";
  const schema = yup.object({
    username: yup.string().required("Enter username").min(3, "Enter username"),
    email: yup.string().required("Enter your email").email("Incorrect Email"),
    phoneNumber: yup
      .string()
      .length(phoneNumberLength, "Enter your phone number"),
    password: yup
      .string()
      .required("Enter your password")
      .min(8, passwordErrorMessage)
      .minLowercase(1, passwordErrorMessage)
      .minUppercase(1, passwordErrorMessage)
      .minNumbers(1, passwordErrorMessage),
    // there is no validation about Symbols in backend
    //.minSymbols(1, passwordErrorMessage),
  });

  // React-Hook-form for handling the form's inputs
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
  });

  // Fetch the api from the Global state
  const sendOtpRegister = useSignUpData((state) => state.sendOtpRegister);
  const isLoading = useSignUpData((state) => state.isLoading);

  const [state, setState] = useState({
    securePassword: true,
    isAgree: false,
  });

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const { securePassword, isAgree } = state;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {registerTitleWithBackButton()}
        <ScrollView>
          {usernameTextField({ name: "username", control: control })}
          {emailTextField({ name: "email", control: control })}
          {phoneNumberTextField({ name: "phoneNumber", control: control })}
          {passwordTextField({ name: "password", control: control })}
          {agreeOrNotInfo()}
          {signupButton()}
        </ScrollView>
      </View>
      {alreadyAccountInfo()}
      {Loading({ isLoading: isLoading })}
    </SafeAreaView>
  );

  function agreeOrNotInfo() {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.agreeOrNotInfoWrapStyle}
        onPress={() => updateState({ isAgree: !isAgree })}
      >
        <View
          style={{
            backgroundColor: isAgree ? Colors.primaryColor : "transparent",
            borderColor: isAgree ? Colors.primaryColor : Colors.whiteColor,
            ...styles.checkBoxStyle,
          }}
        >
          {isAgree ? (
            <MaterialIcons name="check" color={"#fff"} size={14} />
          ) : null}
        </View>
        <Text style={{ marginLeft: Sizes.fixPadding + 2.0 }}>
          <Text style={{ ...Fonts.whiteColor14Medium }}>
            By creating an account, you agree to our {}
          </Text>
          <Text style={{ ...Fonts.primaryColor14Medium }}>
            Terms and Condition
          </Text>
        </Text>
      </TouchableOpacity>
    );
  }

  function alreadyAccountInfo() {
    return (
      <Text style={{ textAlign: "center", margin: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.whiteColor14Medium }}>
          Already have an account? {}
        </Text>
        <Text
          onPress={() => navigation.push("Login")}
          style={{ ...Fonts.primaryColor14Medium }}
        >
          Login
        </Text>
      </Text>
    );
  }

  function signupButton() {
    const onSubmit = handleSubmit(
      (data) => sendOtpRegister(data, navigation),
      () => console.log(errors)
    );
    return (
      <TouchableOpacity
        disabled={!!Object.keys(errors).length || !isAgree}
        activeOpacity={0.9}
        onPress={onSubmit}
        style={{
          ...styles.signupButtonStyle,
          opacity: Object.keys(errors).length || !isAgree ? 0.7 : 1,
        }}
      >
        <Text style={{ ...Fonts.whiteColor20SemiBold, color: Colors.buttonTextColor }}>
          Sign Up
        </Text>
      </TouchableOpacity>
    );
  }

  function passwordTextField({ name, control }) {
    // Use Controller from React-Hook-Form to handle the field
    const { field } = useController({
      control,
      name,
    });
    return (
      <>
        <View
          style={{
            ...styles.textFieldWrapStyle,
            justifyContent: "space-between",
            borderWidth: errors?.password ? 1 : 0,
            borderColor: Colors.errorColor,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons
              name="lock-open"
              size={20}
              color={Colors.inputTextColor}
            />
            <TextInput
              value={field.value}
              onChangeText={field.onChange}
              placeholder="Enter Password"
              secureTextEntry={securePassword}
              placeholderTextColor={Colors.inputTextColor}
              style={{
                ...Fonts.whiteColor14Medium,
                color: Colors.inputTextColor,
                flex: 1,
                marginLeft: Sizes.fixPadding + 2.0,
                marginRight: Sizes.fixPadding
              }}
              selectionColor={Colors.primaryColor}
            />
            <MaterialCommunityIcons
                name={securePassword ? "eye" : "eye-off"}
                size={20}
                color={Colors.inputTextColor}
                onPress={() => updateState({ securePassword: !securePassword })}
            />
          </View>
        </View>
        {errors?.password ? (
          <Text
            style={{
              marginHorizontal: Sizes.fixPadding * 2.0,
              marginTop: Sizes.fixPadding,
              color: Colors.errorColor,
            }}
          >
            {errors?.password.message}
          </Text>
        ) : null}
      </>
    );
  }

  function phoneNumberTextField({ name, control }) {
    // Use Controller from React-Hook-Form to handle the field
    const { field } = useController({
      control,
      name,
    });
    return (
      <>
        <IntlPhoneInput
          containerStyle={{
            ...styles.textFieldWrapStyle,
            paddingVertical: 4,
            marginBottom: errors?.phoneNumber ? 0 : Sizes.fixPadding * 2.0,
            borderWidth: errors?.phoneNumber ? 1 : 0,
            borderColor: Colors.errorColor,
          }}
          phoneInputStyle={{
            ...Fonts.whiteColor14Medium,
            color: Colors.inputTextColor,
            flex: 1,
            marginLeft: Sizes.fixPadding + 2.0,
          }}
          dialCodeTextStyle={{ ...Fonts.whiteColor14Medium, color: Colors.inputTextColor, marginLeft: 10 }}
          modalContainer={{ ...Fonts.whiteColor14Medium }}
          defaultCountry="TR"
          placeholderTextColor={"#949494"}
          placeholder={"Enter Phone Number"}
          onChangeText={(data) => {
            setPhoneNumberLength(
              `${data.dialCode}${data.selectedCountry.mask}`
                .split("")
                .filter((i) => Number.isInteger(+i) && i !== " ")
                .join("").length + 1
            );
            field.onChange(`${data.dialCode}${data.unmaskedPhoneNumber}`);
          }}
        />
        {errors?.phoneNumber ? (
          <Text
            style={{
              marginHorizontal: Sizes.fixPadding * 2.0,
              marginBottom: Sizes.fixPadding * 2.0,
              marginTop: Sizes.fixPadding,
              color: Colors.errorColor,
            }}
          >
            {errors?.phoneNumber.message}
          </Text>
        ) : null}
      </>
    );
  }

  function emailTextField({ name, control }) {
    // Use Controller from React-Hook-Form to handle the field
    const { field } = useController({
      control,
      name,
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
          <MaterialIcons name="email" size={20} color={Colors.inputTextColor} />
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Enter Email"
            placeholderTextColor={Colors.inputTextColor}
            style={{
              ...Fonts.whiteColor14Medium,
              color: Colors.inputTextColor,
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

  function usernameTextField({ name, control }) {
    // Use Controller from React-Hook-Form to handle the field
    const { field } = useController({
      control,
      name,
    });
    return (
      <>
        <View
          style={{
            ...styles.textFieldWrapStyle,
            marginBottom: errors?.username ? 0 : Sizes.fixPadding * 2.0,
            borderWidth: errors?.username ? 1 : 0,
            borderColor: Colors.errorColor,
          }}
        >
          <AntDesign name="user" size={20} color={Colors.inputTextColor} />
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Enter Username"
            placeholderTextColor={Colors.inputTextColor}
            style={{
              ...Fonts.whiteColor14Medium,
              color: Colors.inputTextColor,
              flex: 1,
              marginLeft: Sizes.fixPadding + 2.0,
            }}
            selectionColor={Colors.primaryColor}
            keyboardType="default"
          />
        </View>
        {errors?.username ? (
          <Text
            style={{
              marginHorizontal: Sizes.fixPadding * 2.0,
              marginBottom: Sizes.fixPadding * 2.0,
              marginTop: Sizes.fixPadding,
              color: Colors.errorColor,
            }}
          >
            {errors?.username.message}
          </Text>
        ) : null}
      </>
    );
  }

  function registerTitleWithBackButton() {
    return (
      <View
        style={{ marginVertical: Sizes.fixPadding * 4.0, alignItems: "center" }}
      >
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 2.0,
            alignSelf: "flex-start",
            ...styles.backArrowWrapStyle,
          }}
        >
          <MaterialIcons
            name="chevron-left"
            color={Colors.whiteColor}
            size={26}
            onPress={() => navigation.pop()}
          />
        </View>
        <Text style={{ ...Fonts.whiteColor26SemiBold }}>Get Started!</Text>
        <Text style={{ ...Fonts.whiteColor14Medium }}>
          Create an account to continue.
        </Text>
      </View>
    );
  }
};

export default RegisterScreen;
