import { useCallback } from "react";
import { Linking, TouchableOpacity } from "react-native";
import { localAlert } from "./localAlert";
const OpenLink = ({ url, message, children }) => {
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      localAlert("Page not found");
    }
  }, [url]);

  const noUrl = () => localAlert(message);
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={url === "" ? noUrl : handlePress}
    >
      {children}
    </TouchableOpacity>
  );
};

export default OpenLink;
