import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import useLocalData from "../../Data/localData/useLocalData";

const termsOfUseList = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non enim ut mollis interdum fames pulvinar pharetra odioCurabitur mauris at porta viverra odio lobortis quis.",
  "Orci cras ridiculus etiam orci. Nulla praesent nunc ornaresed sed ut velit, ullamcorper. Sagittis pulvinar feugiat est consequat non mi. At turpis aliquam consectetur tellus quam amet, nam fringilla turpis.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Nemo enim ipsam voluptatem quia voluptas sit aspernatuaut odit aut fugit, sed quia consequuntur magni dolores.",
];

const companyPoliciesList = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non enim ut mollis interdum fames pulvinar pharetra odioCurabitur mauris at porta viverra odio lobortis quis.",
  "Orci cras ridiculus etiam orci. Nulla praesent nunc ornaresed sed ut velit, ullamcorper. Sagittis pulvinar feugiat est consequat non mi. At turpis aliquam consectetur tellus quam amet, nam fringilla turpis.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Nemo enim ipsam voluptatem quia voluptas sit aspernatuaut odit aut fugit, sed quia consequuntur magni dolores.",
];

const TermsAndConditionsScreen = ({ navigation }) => {
  // Get Colors from the Global state
  const { Colors, Fonts, Sizes } = useLocalData((state) => state.styles);

  const styles = StyleSheet.create({
    backArrowWrapStyle: {
      width: 40.0,
      height: 40.0,
      borderRadius: 20.0,
      backgroundColor: Colors.tabIconBgColor,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: Sizes.fixPadding }}
        >
          {termsOfUseInfo()}
          {companyPoliciesInfo()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );

  function companyPoliciesInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <Text
          style={{
            marginBottom: Sizes.fixPadding,
            ...Fonts.whiteColor18SemiBold,
          }}
        >
          Company Policy
        </Text>
        {companyPoliciesList.map((item, index) => (
          <Text key={`${index}`} style={{ ...Fonts.grayColor13Regular }}>
            {item}
          </Text>
        ))}
      </View>
    );
  }

  function termsOfUseInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <Text
          style={{
            marginBottom: Sizes.fixPadding,
            ...Fonts.whiteColor18SemiBold,
          }}
        >
          Terms of Use
        </Text>
        {termsOfUseList.map((item, index) => (
          <Text key={`${index}`} style={{ ...Fonts.grayColor13Regular }}>
            {item}
          </Text>
        ))}
      </View>
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
            color={Colors.primaryColor}
            size={26}
            onPress={() => navigation.pop()}
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
          Terms & Conditions
        </Text>
      </View>
    );
  }
};

export default TermsAndConditionsScreen;
