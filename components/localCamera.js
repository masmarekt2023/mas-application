import { Camera, CameraType } from "expo-camera";
import React, { useEffect, useState } from "react";
import {TouchableOpacity, View, Dimensions, StyleSheet, SafeAreaView, StatusBar} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import useLocalData from "../Data/localData/useLocalData";
import * as Permissions from "expo-permissions";


const {width, height} = Dimensions.get('screen');

const screenWidth = width < height ? width : height;
const screenHeight = height > width ? height : width;
export const LocalCamera = ({ navigation }) => {
  // Get Colors from the Global state
  const { Colors, Sizes } = useLocalData((state) => state.styles);

  // The style Object
  const styles = StyleSheet.create({
    button: {
      position: "absolute",
      height: 50,
      width: 50,
      bottom: -screenHeight + 120,
      borderRadius: 30,
      backgroundColor: Colors.grayColor,
      justifyContent: "center",
      alignItems: "center",
    },
    arrow: {
      width: 40.0,
      height: 40.0,
      borderRadius: 20.0,
      backgroundColor: Colors.inputBgColor,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      left: Sizes.fixPadding * 2.0,
      top: Sizes.fixPadding * 4.0,
    },
  });

  const setCameraPicUrl = useLocalData((state) => state.setCameraPicUrl);

  const [type, setType] = useState(CameraType.back);
  const [camera, setCamera] = useState();

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  const snapPhoto = async () => {
    if (camera) {
      const data = await camera?.takePictureAsync();
      setCameraPicUrl(data.uri);
      navigation.pop();
    }
  };

  useEffect(() => {
    const getData = async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      if (status !== "granted") navigation.pop();
    };

    getData();
  }, []);

  return (
    <SafeAreaView style={{ width: screenWidth, height: screenHeight }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <Camera
        style={{ flex: 1, position: "relative" }}
        type={type}
        ref={(ref) => setCamera(ref)}
      >
        <View>
          <TouchableOpacity style={{...styles.button, left: 20}}>
            <MaterialIcons
                name="chevron-left"
                color={Colors.primaryColor}
                size={26}
                onPress={() => navigation.goBack()}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleCameraType}
            style={{ ...styles.button, right: 20 }}
          >
            <Ionicons
              name="reload-outline"
              size={30}
              color={Colors.primaryColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ ...styles.button, right: screenWidth * 0.5 - 25 }}
            onPress={snapPhoto.bind(this)}
          >
            <View
              style={{
                width: 30,
                height: 30,
                backgroundColor: Colors.primaryColor,
                borderRadius: 30,
              }}
            />
          </TouchableOpacity>
        </View>
      </Camera>
    </SafeAreaView>
  );
};
