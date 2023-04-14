import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack";
import { LogBox, Text, View, StyleSheet } from "react-native";
import LoadingScreen from "./components/loadingScreen";
import BottomTabBarScreen from "./components/bottomTabBarScreen";
import LiveAuctionsDetailScreen from "./screens/liveAuctionsDetail/liveAuctionsDetailScreen";
import ConnectWalletScreen from "./screens/wallet/connectWallet/connectWalletScreen";
import CreatorProfileScreen from "./screens/creatorProfile/creatorProfileScreen";
import NFTUploadSuccessScreen from "./screens/NFTUploadSuccess/NFTUploadSuccessScreen";
import SettingScreen from "./screens/setting/settingScreen";
import EditProfileScreen from "./screens/profile/editProfile/editProfileScreen";
import WalletScreen from "./screens/wallet/walletScreen";
import FaqsScreen from "./screens/faqs/faqsScreen";
import ContactUsScreen from "./screens/contactUs/contactUsScreen";
import TermsAndConditionsScreen from "./screens/termsAndConditions/termsAndConditionsScreen";
import LoginScreen from "./screens/auth/loginScreen";
import RegisterScreen from "./screens/auth/registerScreen";
import VerificationScreen from "./screens/auth/verificationScreen";
import ForgetPassword from "./screens/auth/ForgetPassword";
import FlashMessage from "react-native-flash-message";
import ResetPassword from "./screens/auth/ResetPassword";
import PasswordUpdateSuccess from "./screens/auth/PasswordUpdateSuccess";
import SignUpSuccess from "./screens/auth/SignUpSuccess";
import AllCreators from "./screens/home/AllCreators";
import AllBundles from "./screens/home/AllBundles";
import useLocalData from "./Data/localData/useLocalData";
import { LocalCamera } from "./components/localCamera";
import UserChatScreen from "./screens/Chat/UserChatScreen";
import notificationScreen from "./screens/notification/notificationScreen";
import WithdrawScreen from "./screens/wallet/Withdraw/WithdrawScreen";
import DonateScreen from "./screens/wallet/Donate/DonateScreen";
import ShareForAudienceScreen from "./screens/profile/ShareForAudience/ShareForAudienceScreen";
import TransferFunds from "./screens/wallet/TransferFunds/TransferFunds";
import WalletSuccessScreen from "./screens/wallet/WalletSuccessScreen/WalletSuccessScreen";
import EditBundle from "./screens/liveAuctionsDetail/EditBundle/EditBundle";
import WithdrawSuccessScreen from "./screens/wallet/Withdraw/WithdrawSuccessScreen";
import Story from "./screens/home/Story";
import profileScreen from "./screens/profile/profileScreen";
import LoadingAfterLogin from "./components/LodingAfterLogin";

LogBox.ignoreAllLogs();

const Stack = createStackNavigator();

const App = () => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes } = useLocalData((state) => state.styles);

  // The style Object
  const styles = StyleSheet.create({
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

  // Get status from the global state
  const isCopied = useLocalData((state) => state.isCopied);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        <Stack.Screen
          name="Loading"
          component={LoadingScreen}
          options={{ ...TransitionPresets.DefaultTransition }}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen
          name="PasswordUpdateSuccess"
          component={PasswordUpdateSuccess}
        />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen name="SignUpSuccess" component={SignUpSuccess} />
        <Stack.Screen name="LoadingAfterLogin" component={LoadingAfterLogin} options={{ ...TransitionPresets.DefaultTransition }} />
        <Stack.Screen
          name="BottomTabBar"
          component={BottomTabBarScreen}
          options={{ ...TransitionPresets.DefaultTransition }}
        />
        <Stack.Screen name="Notification" component={notificationScreen} />
        <Stack.Screen name="CreatorProfile" component={CreatorProfileScreen} />
        <Stack.Screen name="AllCreators" component={AllCreators} />
        <Stack.Screen name="AllBundles" component={AllBundles} />
        <Stack.Screen
          name="LiveAuctionsDetail"
          component={LiveAuctionsDetailScreen}
        />
        <Stack.Screen name="EditBundle" component={EditBundle} />
        <Stack.Screen
          name="NFTUploadSuccess"
          component={NFTUploadSuccessScreen}
        />
        <Stack.Screen name="chat" component={UserChatScreen} />
        <Stack.Screen
          name="ShareForAudience"
          component={ShareForAudienceScreen}
        />
        <Stack.Screen name="Setting" component={SettingScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="ProfileScreen" component={profileScreen} />
        <Stack.Screen name="Wallet" component={WalletScreen} />
        <Stack.Screen name="ConnectWallet" component={ConnectWalletScreen} />
        <Stack.Screen name="withdraw" component={WithdrawScreen} />
        <Stack.Screen
          name="WithdrawSuccess"
          component={WithdrawSuccessScreen}
        />
        <Stack.Screen name="TransferFunds" component={TransferFunds} />
        <Stack.Screen name="donate" component={DonateScreen} />
        <Stack.Screen name="WalletSuccess" component={WalletSuccessScreen} />
        <Stack.Screen name="Faqs" component={FaqsScreen} />
        <Stack.Screen name="ContactUs" component={ContactUsScreen} />
        <Stack.Screen
          name="TermsAndConditions"
          component={TermsAndConditionsScreen}
        />
        <Stack.Screen name="LocalCamera" component={LocalCamera} />
        <Stack.Screen
          name="Story"
          component={Story}
          options={{ ...TransitionPresets.DefaultTransition }}
        />
      </Stack.Navigator>
      <FlashMessage position="top" />
      {isCopied ? (
        <View style={[styles.animatedView]}>
          <Text
            style={{
              ...Fonts.grayColor14Regular,
              color: Colors.customAlertTextColor,
              fontWeight: "800",
            }}
          >
            Copied Successfully !
          </Text>
        </View>
      ) : null}
    </NavigationContainer>
  );
};

export default App;
