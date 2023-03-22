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
import {
  MaterialIcons,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React, {useEffect, useState} from "react";
import { useController, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import useForgetPasswordData from "../../Data/useForgetPasswordData";
import YupPassword from "yup-password";
import useResetPasswordData from "../../Data/useResetPasswordData";
import Loading from "../../components/Loading";
import {showMessage} from "react-native-flash-message";
import useLocalData from "../../Data/localData/useLocalData";

const ResetPassword = ({ navigation }) => {
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
    altTitle: {
      margin: Sizes.fixPadding * 2.0,
      color: Colors.whiteColor,
      textAlign: "center",
      lineHeight: 30,
      fontSize: 20,
      fontWeight: "600",
    },
  });

  // Yup Validation
  YupPassword(yup);
  const passwordErrorMessage =
    "Password must contain at least 8 characters, one uppercase and one number";
  const schema = yup.object({
    email: yup.string().email(),
    code: yup
      .string()
      .required("Enter the 6-digit code sent to your email")
      .min(6, "Enter the 6-digit code sent to your email"),
    password: yup
      .string()
      .required(passwordErrorMessage)
      .min(8, passwordErrorMessage)
      .minLowercase(1, passwordErrorMessage)
      .minUppercase(1, passwordErrorMessage)
      .minNumbers(1, passwordErrorMessage),
  });

  // React-Hook-form for handling the form's inputs
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      email: useForgetPasswordData((state) => state.email),
      code: "",
      password: "",
    },
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
  });

  // Fetch the api from the Api
  const resetPassword = useResetPasswordData((state) => state.resetPassword);
  const sendCode = useForgetPasswordData((state) => state.sendCode);
  const isLoading = useResetPasswordData((state) => state.isLoading);

  // Show Password
  const [securePassword, setSecurePassword] = useState(true);
  const [allowGetCode, setAllowGetCode] = useState(false);

  // Allow the user to send the code after 60 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setAllowGetCode(true);
    }, 60000);
    return () => clearTimeout(timer);
  }, [allowGetCode]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.altTitle}>
            To secure your account, please complete the following verification.
          </Text>
          {codeTextField({ name: "code", control: control })}
          {passwordTextField({ name: "password", control: control })}
        </ScrollView>
      </View>
      {continueButton()}
      {Loading({ isLoading: isLoading })}
    </SafeAreaView>
  );

  function continueButton() {
    const onSubmit = handleSubmit(
      (data) => resetPassword(data, navigation),
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
        <Text style={{ ...Fonts.whiteColor20SemiBold, color: Colors.buttonTextColor }}>Reset</Text>
      </TouchableOpacity>
    );
  }

  function codeTextField({ name, control }) {
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
            justifyContent: "space-between",
            borderWidth: errors?.code ? 1 : 0,
            borderColor: Colors.errorColor,
            marginTop: Sizes.fixPadding * 2,
            marginBottom: errors?.code ? 0 : Sizes.fixPadding * 2,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Entypo name="key" size={20} color={Colors.whiteColor} />
            <TextInput
              value={field.value}
              onChangeText={field.onChange}
              placeholder="Enter Email Validation Code"
              placeholderTextColor={Colors.grayColor}
              style={{
                ...Fonts.whiteColor14Medium,
                marginLeft: Sizes.fixPadding + 2.0,
              }}
              selectionColor={Colors.primaryColor}
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              if(allowGetCode){
                setAllowGetCode(false);
                sendCode({ email: getValues("email") });
              }else {
                showMessage({
                  message: "You can get another code after 60 seconds",
                  type: "warning",
                  titleStyle: { fontWeight: "bold", fontSize: 16 },
                });
              }
            }}
          >
            <Text style={Fonts.whiteColor14Medium}>Get Code</Text>
          </TouchableOpacity>
        </View>
        {errors?.code ? (
          <Text
            style={{
              marginHorizontal: Sizes.fixPadding * 2.0,
              color: Colors.errorColor,
              marginTop: Sizes.fixPadding,
              marginBottom: Sizes.fixPadding * 2,
            }}
          >
            {errors?.code.message}
          </Text>
        ) : null}
      </>
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
              color={Colors.whiteColor}
            />
            <TextInput
              value={field.value}
              onChangeText={field.onChange}
              placeholder="Enter Your New Password"
              secureTextEntry={securePassword}
              placeholderTextColor={Colors.grayColor}
              style={{
                ...Fonts.whiteColor14Medium,
                marginLeft: Sizes.fixPadding + 2.0,
              }}
              selectionColor={Colors.primaryColor}
            />
          </View>
          <MaterialCommunityIcons
            name={securePassword ? "eye" : "eye-off"}
            size={20}
            color={Colors.whiteColor}
            onPress={() => setSecurePassword((prevState) => !prevState)}
          />
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
          Security Verification
        </Text>
      </View>
    );
  }
};

export default ResetPassword;
