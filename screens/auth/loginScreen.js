import React, { useState, useCallback } from "react";
import {
  BackHandler,
  SafeAreaView,
  View,
  StatusBar,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useController, useForm } from "react-hook-form";
import * as yup from "yup";
import YupPassword from "yup-password";
import { yupResolver } from "@hookform/resolvers/yup";
import useLoginData from "../../Data/useLoginData";
import Loading from "../../components/Loading";
import useLocalData from "../../Data/localData/useLocalData";

const LoginScreen = ({ navigation }) => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes } = useLocalData((state) => state.styles);

  // The style Object
  const styles = StyleSheet.create({
    backArrowWrapStyle: {
      width: 40.0,
      height: 40.0,
      borderRadius: 20.0,
      backgroundColor: "rgba(255,255,255,0.05)",
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
    loginButtonStyle: {
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
  });

  // Yup inputs validation
  YupPassword(yup);
  const passwordErrorMessage =
    "Password must contain at least 8 characters, one uppercase and one number";
  const schema = yup.object({
    email: yup.string().required("Enter your email").email("Incorrect Email"),
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
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
  });

  // Fetch the api from the Api
  const Login = useLoginData((state) => state.Login);
  const isLoading = useLoginData((state) => state.isLoading);

  const [state, setState] = useState({
    securePassword: true,
    backClickCount: 0,
  });

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const { securePassword, backClickCount } = state;

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
    updateState({ backClickCount: 1 });
    setTimeout(() => {
      updateState({ backClickCount: 0 });
    }, 1000);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ScrollView>
          {loginTitle()}
          {emailTextField({ name: "email", control: control })}
          {passwordTextField({ name: "password", control: control })}
          {forgetPasswordText()}
          {loginButton()}
          {dontAccountInfo()}
        </ScrollView>
      </View>
      {backClickCount === 1 ? (
        <View style={[styles.animatedView]}>
          <Text
            style={{
              ...Fonts.grayColor14Regular,
              color: Colors.customAlertTextColor,
            }}
          >
            Press Back Once Again To Exit
          </Text>
        </View>
      ) : null}
      {Loading({ isLoading: isLoading })}
    </SafeAreaView>
  );

  function dontAccountInfo() {
    return (
      <Text style={{ textAlign: "center", marginBottom: Sizes.fixPadding * 6.0 }}>
        <Text style={{ ...Fonts.whiteColor14Medium }}>
          Don’t have an account? {}
        </Text>
        <Text
          onPress={() => navigation.push("Register")}
          style={{ ...Fonts.primaryColor14Medium }}
        >
          Sign Up
        </Text>
      </Text>
    );
  }

  function loginButton() {
    // Handle submit button
    const onSubmit = handleSubmit(
      (data) => Login(data, navigation),
      () => console.log(errors)
    );
    return (
      <TouchableOpacity
        disabled={!!Object.keys(errors).length}
        activeOpacity={0.9}
        onPress={onSubmit}
        style={{
          ...styles.loginButtonStyle,
          opacity: Object.keys(errors).length ? 0.7 : 1,
        }}
      >
        <Text
          style={{
            ...Fonts.whiteColor20SemiBold,
            color: Colors.buttonTextColor,
          }}
        >
          Login
        </Text>
      </TouchableOpacity>
    );
  }

  function forgetPasswordText() {
    //return <Text style={styles.forgetPasswordTextStyle}>Forget password?</Text>;
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.push("ForgetPassword")}
      >
        <Text style={styles.forgetPasswordTextStyle}>Forget password?</Text>
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
              placeholderTextColor={Colors.grayColor}
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
            placeholderTextColor={Colors.grayColor}
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

  function loginTitle() {
    return (
      <View
        style={{ marginVertical: Sizes.fixPadding * 4.0, alignItems: "center" }}
      >
        <Text style={{ ...Fonts.whiteColor26SemiBold }}>
          Let’s sign you in.
        </Text>
        <Text style={{ ...Fonts.whiteColor14Medium }}>
          Welcome Back. You’ve been missed!
        </Text>
      </View>
    );
  }
};

export default LoginScreen;
