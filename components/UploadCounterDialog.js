import React from "react";
import { StyleSheet, Dimensions, Text as ReactText } from "react-native";
import Animated, {
  useAnimatedProps,
} from "react-native-reanimated";

import Svg, { Circle, Text } from "react-native-svg";
import Dialog from "react-native-dialog";
import useLocalData from "../Data/localData/useLocalData";

const { width, height } = Dimensions.get("window");

const CIRCLE_LENGTH = 600; // 2PI*R
const R = CIRCLE_LENGTH / (2 * Math.PI);

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function UploadCounterDialog({counter}) {
  const { Fonts, Colors } = useLocalData((state) => state.styles);

  const BACKGROUND_STROKE_COLOR = Colors.tabIconBgColor;
  const STROKE_COLOR = Colors.primaryColor;

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH * (1 - (counter / 100)),
  }));

  return (
    <Dialog.Container
      visible={counter > 0}
      contentStyle={styles.dialogWrapStyle}
      headerStyle={{ margin: 0.0, padding: 0.0 }}
    >
      <Svg>
        <Circle
          cx={(width - 40) / 2}
          cy={(height * 0.4) / 2}
          r={R}
          stroke={BACKGROUND_STROKE_COLOR}
          strokeWidth={10}
        />
        <AnimatedCircle
          cx={(width - 40) / 2}
          cy={(height * 0.4) / 2}
          r={R}
          stroke={STROKE_COLOR}
          strokeWidth={10}
          strokeDasharray={CIRCLE_LENGTH}
          animatedProps={animatedProps}
          strokeLinecap={"round"}
          fill={"#fff"}
        />
        <Text
          x={(width - 40) / 2 - 10}
          y={(height * 0.4) / 2}
          fontSize={40}
          textAnchor="middle"
          alignmentBaseline="central"
          style={Fonts.primaryColor22SemiBold}
        >
          {counter} %
        </Text>
      </Svg>
      <ReactText style={styles.textStyle}>Uploading</ReactText>
    </Dialog.Container>
  );
}

const styles = StyleSheet.create({
  dialogWrapStyle: {
    borderRadius: 5,
    width: width - 40,
    height: height * 0.4,
    padding: 0.0,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    position: "absolute",
    bottom: 20,
    fontSize: 20,
    fontWeight: "500",
  },
});
