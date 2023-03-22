import Dialog from "react-native-dialog";
import { Dimensions, StyleSheet } from "react-native";
import { CircleFade } from "react-native-animated-spinkit";
import React from "react";
import useLocalData from "../Data/localData/useLocalData";

const Loading = ({ isLoading }) => {
  // Get Colors from the Global state
  const { Colors } = useLocalData((state) => state.styles);

  // The style Object

  return (
    <Dialog.Container
      visible={isLoading}
      contentStyle={styles.dialogStyle}
      headerStyle={{ margin: 0.0, padding: 0.0 }}
    >
      <CircleFade size={56} color={Colors.primaryColor} />
    </Dialog.Container>
  );
};

export default Loading;

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  dialogStyle: {
    backgroundColor: "rgb(255,255,255,0.00001)",
    height: height,
    width: width,
    alignItems: "center",
    justifyContent: "center",
    padding: 0.0,
  },
});
