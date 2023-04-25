import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, StyleSheet } from "react-native";
import useLoginData from "../Data/useLoginData";
import useProfileData from "../Data/useProfileData";
import useCreatorsData from "../Data/useCreatorsData";
import useBundlesData from "../Data/useBundlesData";
import useGetAllUsersData from "../Data/useGetAllUsersData";
import useNotificationData from "../Data/useNotificationData";
import useChatData from "../Data/useChatData";
import useStoryData from "../Data/useStoryData";
import useWithdrawData from "../Data/useWithdrawData";
import useDonateData from "../Data/useDonateData";
import useLocalData from "../Data/localData/useLocalData";
const LoadingAfterLogin = ({ navigation }) => {
  // Get Colors from the Global state
  const { Colors } = useLocalData((state) => state.styles);

  const styles = StyleSheet.create({
    containerStyle: {
      backgroundColor: Colors.bodyBackColor,
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },
  });


  const [firstLoad, setFirstLoad] = useState(true);

  // Get user's token from the Login data
  const token = useLoginData((state) => state.userInfo.token);
  const { userId } = useProfileData((state) => state.userData);
  const getProfile = useProfileData((state) => state.getProfile);
  const getCreators = useCreatorsData((state) => state.getCreators);
  const getBundles = useBundlesData((state) => state.getBundles);
  const getAllUsers = useGetAllUsersData((state) => state.getAllUsers);
  const getTopUser = useGetAllUsersData((state) => state.getTopUser);
  const getNotifications = useNotificationData(
    (state) => state.getNotifications
  );
  const getChatList = useChatData((state) => state.getChatList);
  const getTotalEarnings = useProfileData((state) => state.getTotalEarnings);
  const getSubscription = useProfileData((state) => state.getSubscription);
  const getStory = useStoryData((state) => state.getStory);
  const getAllStories = useStoryData((state) => state.getAllStories);

  // get the Loading state for fetched data
  const profileLoading = useProfileData((state) => state.isLoading);
  const creatorsLoading = useCreatorsData((state) => state.isLoading);
  const bundlesLoading = useBundlesData((state) => state.isLoading);
  const allUsersLoading = useGetAllUsersData((state) => state.isLoading);
  const notificationsLoading = useNotificationData((state) => state.isLoading);
  const chatLoading = useChatData((state) => state.isLoading);
  const withdrawLoading = useWithdrawData((state) => state.isLoading);
  const storyLoading = useStoryData((state) => state.isLoading);
  const donationLoading = useDonateData((state) => state.isLoading);
  const isLoading =
    profileLoading ||
    creatorsLoading ||
    bundlesLoading ||
    allUsersLoading ||
    notificationsLoading ||
    chatLoading ||
    withdrawLoading ||
    storyLoading ||
    donationLoading;

  useEffect(() => {
    getProfile(token);
    getNotifications(token);
    getTotalEarnings(token);
    getSubscription(token);
  }, []);

  useEffect(() => {
    getCreators(token, userId);
    getAllUsers(userId);
    getTopUser();
    getBundles(userId);
    getChatList(token, userId);
    getStory(token, userId);
    getAllStories(token, userId);
  }, [userId]);

  useEffect(() => {
    if (!isLoading && userId.length > 0 && firstLoad) {
      setFirstLoad(false);
      navigation.push("BottomTabBar");
    }
  }, [isLoading, userId, firstLoad]);

  return (
      <SafeAreaView style={styles.containerStyle}>
        <Image style={{width: 200, height: 200}} source={require("../assets/images/loading.gif")}/>
      </SafeAreaView>
  );
};
export default LoadingAfterLogin;