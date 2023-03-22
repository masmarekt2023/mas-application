import { Text, View, StyleSheet } from "react-native";
import useLocalData from "../../../Data/localData/useLocalData";

const UserNotFound = ({isLoading}) => {
  // Get Colors from the Global state
  const { Fonts} = useLocalData((state) => state.styles);
  return (
    <View style={styles.container}>
      <Text style={{ ...Fonts.whiteColor14Medium, fontSize: 20 }}>
        {isLoading ? "Loading Data..." : "Data Not Found"}
      </Text>
    </View>
  );
};

export default UserNotFound;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
});
