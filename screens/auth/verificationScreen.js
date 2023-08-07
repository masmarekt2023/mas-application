import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Dimensions,
  View,
  StatusBar,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CircleFade } from "react-native-animated-spinkit";
import Dialog from "react-native-dialog";
import * as yup from "yup";
import { useController, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import useVerificationData from "../../Data/useVerificationData";
import useSignUpData from "../../Data/useSignUpData";
import useWithdrawData from "../../Data/useWithdrawData";
import useLocalData from "../../Data/localData/useLocalData";
import { localAlert } from "../../components/localAlert";

const { width } = Dimensions.get("window");

const VerificationScreen = ({ navigation, route }) => {
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
    otpFieldsContentStyle: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginHorizontal: Sizes.fixPadding * 2.0,
    },
    textFieldContentStyle: {
      height: 60.0,
      flex: 1,
      borderRadius: Sizes.fixPadding - 5.0,
      backgroundColor: Colors.inputBgColor,
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: Sizes.fixPadding / 2,
    },
    verifyButtonStyle: {
      backgroundColor: Colors.primaryColor,
      paddingVertical: Sizes.fixPadding + 5.0,
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: Sizes.fixPadding * 2.0,
      marginTop: Sizes.fixPadding * 4.0,
      marginBottom: Sizes.fixPadding * 2.0,
      borderRadius: Sizes.fixPadding - 5.0,
    },
    dialogStyle: {
      borderRadius: Sizes.fixPadding - 5.0,
      width: width - 40,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.bodyBackColor,
      padding: 0.0,
    },
  });

  // Yup inputs validation
  const schema = yup.object({
    first: yup.string().required(),
    second: yup.string().required(),
    third: yup.string().required(),
    fourth: yup.string().required(),
    fifth: yup.string().required(),
    sixth: yup.string().required(),
  });

  // React-Hook-form for handling the form's inputs
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setFocus,
    setValue,
  } = useForm({
    defaultValues: {
      first: "",
      second: "",
      third: "",
      fourth: "",
      fifth: "",
      sixth: "",
    },
    resolver: yupResolver(schema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  // Fetch the api from the Global state
  const token = route.params.token;
  const channel = route.params.channel;
  const context = route.params.context;
  const signUpData = route.params.data;
  const withdrawData = route.params.withdrawData;
  const sendOpt = useVerificationData((state) => state.sendOpt);
  const sendOtpRegister = useSignUpData((state) => state.sendOtpRegister);
  const signUp = useSignUpData((state) => state.SignUp);
  const verificationOtp = useVerificationData((state) => state.verificationOtp);
  const verificationWithdraw = useWithdrawData(
    (state) => state.verificationWithdraw
  );
  const isLoading = useVerificationData((state) => state.isLoading);

  useEffect(() => {
    if (context === "withdraw" || context === "verifyLater") {
      sendOpt(token, channel, context);
    }
    setFocus("first");
  }, []);

  useEffect(() => {
    const onSubmit = handleSubmit(
      (data) => {
        const otpCode = Object.values(data).join("");
        if (signUpData) {
          signUp({ ...signUpData, otp: otpCode }, navigation);
        } else if (context === "withdraw") {
          verificationWithdraw(otpCode, navigation, token, withdrawData);
        } else {
          verificationOtp(otpCode, navigation, token, channel, context);
        }
      },
      () => console.log(errors)
    );
    if (isValid) {
      onSubmit();
    }
  }, [isValid]);

  // Allow the user to send the code after 60 seconds
  const [allowGetCode, setAllowGetCode] = useState(false);
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
        {verificationInfoWithBackButton()}
        {otpFields()}
        {resendInfo()}
        {verifyButton()}
      </View>
      {loading()}
    </SafeAreaView>
  );

  function loading() {
    return (
      <Dialog.Container
        visible={isLoading}
        contentStyle={styles.dialogStyle}
        headerStyle={{ margin: 0.0, padding: 0.0 }}
      >
        <View
          style={{
            marginVertical: Sizes.fixPadding * 2.0,
            backgroundColor: Colors.bodyBackColor,
            alignItems: "center",
          }}
        >
          <CircleFade size={56} color={Colors.primaryColor} />
          <Text
            style={{
              ...Fonts.whiteColor14Medium,
              marginTop: Sizes.fixPadding * 2.0,
            }}
          >
            Please wait...
          </Text>
        </View>
      </Dialog.Container>
    );
  }

  function verifyButton() {
    const onSubmit = handleSubmit(
      (data) => {
        const otpCode = Object.values(data).join("");
        if (signUpData) {
          signUp({ ...signUpData, otp: otpCode }, navigation);
        } else if (context === "withdraw") {
          verificationWithdraw(otpCode, navigation, token, withdrawData);
        } else {
          verificationOtp(otpCode, navigation, token, channel, context);
        }
      },
      () => console.log(errors)
    );
    return (
      <TouchableOpacity
        disabled={!!Object.keys(errors).length}
        activeOpacity={0.9}
        onPress={onSubmit}
        style={{
          ...styles.verifyButtonStyle,
          opacity: Object.keys(errors).length ? 0.7 : 1,
        }}
      >
        <Text
          style={{
            ...Fonts.whiteColor20SemiBold,
            color: Colors.buttonTextColor,
          }}
        >
          Verify
        </Text>
      </TouchableOpacity>
    );
  }

  function resendInfo() {
    return (
      <View
        style={{
          marginTop: Sizes.fixPadding * 3.0,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Text style={{ ...Fonts.whiteColor14Medium }}>
          Didn’t receive any code? {}
        </Text>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            if (allowGetCode) {
              if (signUpData) {
                sendOtpRegister(signUpData, navigation);
              } else {
                sendOpt(token, channel, context);
              }
            } else {
              localAlert("You can get another code after 60 seconds");
            }
          }}
        >
          <Text
            style={{
              ...Fonts.primaryColor14Medium,
              opacity: allowGetCode ? 1 : 0.5,
            }}
          >
            Resend New Code
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function otpFields() {
    return (
      <View style={styles.otpFieldsContentStyle}>
        {optFiled({
          name: "first",
          control: control,
          focusInput: { prev: "first", recant: "second" },
        })}
        {optFiled({
          name: "second",
          control: control,
          focusInput: { prev: "first", recant: "third" },
        })}
        {optFiled({
          name: "third",
          control: control,
          focusInput: { prev: "second", recant: "fourth" },
        })}
        {optFiled({
          name: "fourth",
          control: control,
          focusInput: { prev: "third", recant: "fifth" },
        })}
        {optFiled({
          name: "fifth",
          control: control,
          focusInput: { prev: "fourth", recant: "sixth" },
        })}
        {optFiled({
          name: "sixth",
          control: control,
          focusInput: { prev: "fifth", recant: "sixth" },
        })}
      </View>
    );
  }

  function optFiled({ name, control, focusInput }) {
    // Use Controller from React-Hook-Form to handle the field
    const { field } = useController({
      control,
      name,
    });
    return (
      <View
        style={{
          ...styles.textFieldContentStyle,
          borderWidth: errors[name] ? 1 : 0,
          borderColor: Colors.errorColor,
        }}
      >
        <TextInput
          selectionColor={Colors.inputTextColor}
          value={field.value}
          style={{
            ...Fonts.whiteColor14Medium,
            color: Colors.inputTextColor,
            paddingLeft: Sizes.fixPadding,
          }}
          ref={field.ref}
          onChangeText={(text) => {
            if (text.length > 1) {
              setFocus(focusInput.recant);
              setValue(focusInput.recant, text.slice(-1));
            } else {
              field.onChange(text);
              text.length === 1
                ? setFocus(focusInput.recant)
                : setFocus(focusInput.prev);
            }
          }}
          onBlur={field.onBlur}
          keyboardType="numeric"
        />
      </View>
    );
  }

  function verificationInfoWithBackButton() {
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
        <Text style={{ ...Fonts.whiteColor26SemiBold }}>Verification</Text>
        <Text style={{ textAlign: "center", ...Fonts.whiteColor14Medium, lineHeight: 26 }}>
          {`We have sent otp code to your ${
            channel === "email" ? "email" : "phone"
          } copy the code and paste it here to confirm`}
        </Text>
      </View>
    );
  }
};

export default VerificationScreen;
