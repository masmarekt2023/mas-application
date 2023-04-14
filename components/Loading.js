import Dialog from "react-native-dialog";
import {Dimensions, Image, StyleSheet} from "react-native";
import React from "react";

const Loading = ({ isLoading }) => {

  // The style Object

  return (
    <Dialog.Container
      visible={isLoading}
      contentStyle={styles.dialogStyle}
      headerStyle={{ margin: 0.0, padding: 0.0 }}
    >
      <Image style={{width: 200, height: 200}} source={require("../assets/images/loading.gif")}/>
    </Dialog.Container>
  );

};

export default Loading;

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  dialogStyle: {
    backgroundColor: "rgb(255, 255, 255, 0.01)",
    height: height,
    width: width,
    alignItems: "center",
    justifyContent: "center",
    padding: 0.0,
  },
});
