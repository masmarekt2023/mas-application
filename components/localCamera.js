import { Camera, CameraType } from "expo-camera";
import React, {useEffect, useState} from "react";
import { TouchableOpacity, View, Dimensions, StyleSheet } from "react-native";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import useLocalData from "../Data/localData/useLocalData";
import * as Permissions from 'expo-permissions';

const size = Dimensions.get("screen");
export const LocalCamera = ({ navigation }) => {
  // Get Colors from the Global state
  const { Colors, Sizes } = useLocalData((state) => state.styles);

  // The style Object
  const styles = StyleSheet.create({
    button: {
      position: "absolute",
      height: 50,
      width: 50,
      bottom: -size.height + 120,
      right: 20,
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
      top : Sizes.fixPadding * 2.0,
    }
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

  useEffect(async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if(status !== "granted") navigation.pop();
  }, []);

  return (
    <View style={{ width: size.width, height: size.height }}>
      <Camera
        style={{ flex: 1, position: "relative" }}
        type={type}
        ref={(ref) => setCamera(ref)}
      >
        <View style={styles.arrow}>
          <MaterialIcons
              name="chevron-left"
              color={Colors.primaryColor}
              size={26}
              onPress={() => navigation.goBack()}
          />
        </View>
        <View>
          <TouchableOpacity
            onPress={toggleCameraType}
            style={{ ...styles.button, right: 20 }}
          >
            <Ionicons
              name="reload-outline"
              size={30}
              color={Colors.buttonTextColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ ...styles.button, right: size.width * 0.5 - 25 }}
            onPress={snapPhoto.bind(this)}
          >
            <View
              style={{
                width: 30,
                height: 30,
                backgroundColor: Colors.buttonTextColor,
                borderRadius: 30,
              }}
            />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};
