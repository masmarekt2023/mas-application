import {Camera, CameraType} from "expo-camera";
import React, {useEffect, useState} from "react";
import {
    TouchableOpacity,
    View,
    StyleSheet,
    SafeAreaView,
    StatusBar,
} from "react-native";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import useLocalData from "../Data/localData/useLocalData";
import * as Permissions from "expo-permissions";


export const LocalCamera = ({navigation}) => {
    // Get Colors from the Global state
    const {Colors, Sizes} = useLocalData((state) => state.styles);

    // The style Object
    const styles = StyleSheet.create({
        button: {
            height: 50,
            width: 50,
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
        buttonsContainerStyle: {
            flexDirection: "row",
            height: 120,
            backgroundColor: "#000",
            paddingHorizontal: Sizes.fixPadding * 2,
            alignItems: "center",
            justifyContent: "space-between",
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

    useEffect(() => {
        const getData = async () => {
            const {status} = await Permissions.askAsync(Permissions.CAMERA);
            if (status !== "granted") navigation.pop();
        };

        getData();
    }, []);

    return (
        <SafeAreaView style={{flex: 1}}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor}/>
            <View style={{height: 100, backgroundColor: '#000'}}/>
            <Camera style={{flex: 1}} type={type} ref={(ref) => setCamera(ref)}/>
            <View
                style={styles.buttonsContainerStyle}
            >
                <TouchableOpacity style={styles.button}>
                    <MaterialIcons
                        name="chevron-left"
                        color={Colors.primaryColor}
                        size={26}
                        onPress={() => navigation.goBack()}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={snapPhoto.bind(this)}>
                    <View
                        style={{
                            width: 30,
                            height: 30,
                            backgroundColor: Colors.primaryColor,
                            borderRadius: 30,
                        }}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleCameraType} style={styles.button}>
                    <Ionicons
                        name="reload-outline"
                        size={30}
                        color={Colors.primaryColor}
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
