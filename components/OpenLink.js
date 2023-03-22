import { useCallback } from "react";
import { Linking, TouchableOpacity } from "react-native";
import { showMessage } from "react-native-flash-message";

const OpenLink = ({ url, message,children }) => {
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      showMessage({
        message: "Page not found",
        type: "danger",
        titleStyle: { fontWeight: "bold", fontSize: 16 },
      });
    }
  }, [url]);

  const noUrl = () =>
    showMessage({
      message: message,
      type: "warning",
      titleStyle: { fontWeight: "bold", fontSize: 16 },
    });
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={url === "" ? noUrl : handlePress}>
      {children}
    </TouchableOpacity>
  );
};

export default OpenLink;
