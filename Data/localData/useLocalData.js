import { create } from "zustand";
import { Clipboard } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useLocalData = create((set) => ({
  isCopied: false,
  copyToClipboard: (string) => {
    Clipboard.setString(string);
    set({ isCopied: true });
    setTimeout(() => {
      set({ isCopied: false });
    }, 1500);
  },
  cameraPicUrl: "",
  setCameraPicUrl: (url) => set({ cameraPicUrl: url }),

  // Styles
  lightModeColor: {
    bodyBackColor: "#ffffff",
    blackColor: "#ffffff",
    whiteColor: "#000000",
    primaryColor: "rgba(128,15,47,1)",
    inputBgColor: "#eeeeee",
    tabIconBgColor: "rgba(128,15,47,0.2)",
    iconColor: "#ffffff",
    buttonTextColor: "#ffffff",
    customAlertColor: "rgba(128,15,47,1)",
    customAlertTextColor: "#ffffff",
    grayColor: "#777777",
    greenColor: "#30b983",
    errorColor: "#ef4444",
    facebook: "#4267B2",
    youtube: "#FF0000",
    twitter: "#1DA1F2",
    telegram: "#229ED9",
  },

  darkModeColors: {
    bodyBackColor: "#161622",
    blackColor: "#000000",
    whiteColor: "#FFFFFF",
    primaryColor: "rgba(140,49,255,1)",
    inputBgColor: "rgba(255,255,255,0.05)",
    tabIconBgColor: "rgba(140, 49, 255,0.2)",
    iconColor: "#ffffff",
    buttonTextColor: "#ffffff",
    customAlertColor: "#ffffff",
    customAlertTextColor: "#949494",
    grayColor: "#949494",
    greenColor: "#30b983", //
    errorColor: "#ef4444",
    facebook: "#4267B2",
    youtube: "#FF0000",
    twitter: "#1DA1F2",
    telegram: "#229ED9",
  },

  styles: {
    darkMode: false,
    Colors: {
      bodyBackColor: "#ffffff",
      blackColor: "#ffffff",
      whiteColor: "#000000",
      primaryColor: "#ffa34e",
      inputBgColor: "#eeeeee",
      tabIconBgColor: "rgba(255, 163, 78, 0.2)",
      customAlertColor: "#ffa34e",
      customAlertTextColor: "#ffffff",
      iconColor: "#ffffff",
      buttonTextColor: "#ffffff",
      grayColor: "#949494",
      greenColor: "#30b983",
      errorColor: "#ef4444",
      facebook: "#4267B2",
      youtube: "#FF0000",
      twitter: "#1DA1F2",
      telegram: "#229ED9",
    },
    Fonts: {
      grayColor12Regular: {
        color: "#949494",
        fontSize: 12,
        fontFamily: "SF_Compact_Display_Regular",
      },

      grayColor13Regular: {
        color: "#949494",
        fontSize: 13,
        fontFamily: "SF_Compact_Display_Regular",
      },

      grayColor14Regular: {
        color: "#949494",
        fontSize: 14,
        fontFamily: "SF_Compact_Display_Regular",
      },

      grayColor12Medium: {
        color: "#949494",
        fontSize: 12,
        fontFamily: "SF_Compact_Display_Medium",
      },

      grayColor13Medium: {
        color: "#949494",
        fontSize: 13,
        fontFamily: "SF_Compact_Display_Medium",
      },

      primaryColor14Regular: {
        color: "#ffa34e",
        fontSize: 14,
        fontFamily: "SF_Compact_Display_Regular",
      },

      primaryColor16Regular: {
        color: "#ffa34e",
        fontSize: 16,
        fontFamily: "SF_Compact_Display_Regular",
      },

      primaryColor12Medium: {
        color: "#ffa34e",
        fontSize: 12,
        fontFamily: "SF_Compact_Display_Medium",
      },

      primaryColor14Medium: {
        color: "#ffa34e",
        fontSize: 14,
        fontFamily: "SF_Compact_Display_Medium",
      },

      primaryColor14SemiBold: {
        color: "#ffa34e",
        fontSize: 14,
        fontFamily: "SF_Compact_Display_SemiBold",
      },

      primaryColor16SemiBold: {
        color: "#ffa34e",
        fontSize: 16,
        fontFamily: "SF_Compact_Display_SemiBold",
      },

      primaryColor20SemiBold: {
        color: "#ffa34e",
        fontSize: 20,
        fontFamily: "SF_Compact_Display_SemiBold",
      },

      primaryColor22SemiBold: {
        color: "#ffa34e",
        fontSize: 22,
        fontFamily: "SF_Compact_Display_SemiBold",
      },

      primaryColor14Bold: {
        color: "#ffa34e",
        fontSize: 14,
        fontFamily: "SF_Compact_Display_Bold",
      },

      whiteColor14Regular: {
        color: "#000000",
        fontSize: 14,
        fontFamily: "SF_Compact_Display_Regular",
      },

      whiteColor16Regular: {
        color: "#000000",
        fontSize: 16,
        fontFamily: "SF_Compact_Display_Regular",
      },

      whiteColor22Regular: {
        color: "#000000",
        fontSize: 22,
        fontFamily: "SF_Compact_Display_Regular",
      },

      whiteColor30Regular: {
        color: "#000000",
        fontSize: 30,
        fontFamily: "SF_Compact_Display_Regular",
      },

      whiteColor12Medium: {
        color: "#000000",
        fontSize: 12,
        fontFamily: "SF_Compact_Display_Medium",
      },

      whiteColor14Medium: {
        color: "#000000",
        fontSize: 14,
        fontFamily: "SF_Compact_Display_Medium",
      },

      whiteColor16Medium: {
        color: "#000000",
        fontSize: 16,
        fontFamily: "SF_Compact_Display_Medium",
      },

      whiteColor18Medium: {
        color: "#000000",
        fontSize: 18,
        fontFamily: "SF_Compact_Display_Medium",
      },

      whiteColor14SemiBold: {
        color: "#000000",
        fontSize: 14,
        fontFamily: "SF_Compact_Display_SemiBold",
      },

      whiteColor16SemiBold: {
        color: "#000000",
        fontSize: 16,
        fontFamily: "SF_Compact_Display_SemiBold",
      },

      whiteColor18SemiBold: {
        color: "#000000",
        fontSize: 18,
        fontFamily: "SF_Compact_Display_SemiBold",
      },

      whiteColor20SemiBold: {
        color: "#000000",
        fontSize: 20,
        fontFamily: "SF_Compact_Display_SemiBold",
      },

      whiteColor22SemiBold: {
        color: "#000000",
        fontSize: 22,
        fontFamily: "SF_Compact_Display_SemiBold",
      },

      whiteColor26SemiBold: {
        color: "#000000",
        fontSize: 26,
        fontFamily: "SF_Compact_Display_SemiBold",
      },

      whiteColor16Bold: {
        color: "#000000",
        fontSize: 16,
        fontFamily: "SF_Compact_Display_Bold",
      },

      whiteColor20Bold: {
        color: "#000000",
        fontSize: 20,
        fontFamily: "SF_Compact_Display_Bold",
      },

      whiteColor22Bold: {
        color: "#000000",
        fontSize: 22,
        fontFamily: "SF_Compact_Display_Bold",
      },

      greenColor14Medium: {
        color: "#30b983",
        fontSize: 14,
        fontFamily: "SF_Compact_Display_Medium",
      },
    },
    Sizes: {
      fixPadding: 10.0,
    },
  },
  setDarkMode: async (status, colors) => {
    try {
      await AsyncStorage.setItem("darkMode", status ? "on" : "off");
    } catch (e) {
      console.log("Error in useLocalData / setDarkMode");
    }

    set({
      styles: {
        darkMode: status,
        Colors: colors,
        Fonts: {
          grayColor12Regular: {
            color: colors.grayColor,
            fontSize: 12,
            fontFamily: "SF_Compact_Display_Regular",
            fontWeight: '600',
          },

          grayColor13Regular: {
            color: colors.grayColor,
            fontSize: 13,
            fontFamily: "SF_Compact_Display_Regular",
            fontWeight: '600',
          },

          grayColor14Regular: {
            color: colors.grayColor,
            fontSize: 14,
            fontFamily: "SF_Compact_Display_Regular",
            fontWeight: '600',
          },

          grayColor12Medium: {
            color: colors.grayColor,
            fontSize: 12,
            fontFamily: "SF_Compact_Display_Medium",
            fontWeight: '600',
          },

          grayColor13Medium: {
            color: colors.grayColor,
            fontSize: 13,
            fontFamily: "SF_Compact_Display_Medium",
            fontWeight: '600',
          },

          primaryColor14Regular: {
            color: colors.primaryColor,
            fontSize: 14,
            fontFamily: "SF_Compact_Display_Regular",
          },

          primaryColor16Regular: {
            color: colors.primaryColor,
            fontSize: 16,
            fontFamily: "SF_Compact_Display_Regular",
          },

          primaryColor12Medium: {
            color: colors.primaryColor,
            fontSize: 12,
            fontFamily: "SF_Compact_Display_Medium",
          },

          primaryColor14Medium: {
            color: colors.primaryColor,
            fontSize: 14,
            fontFamily: "SF_Compact_Display_Medium",
          },

          primaryColor14SemiBold: {
            color: colors.primaryColor,
            fontSize: 14,
            fontFamily: "SF_Compact_Display_SemiBold",
          },

          primaryColor16SemiBold: {
            color: colors.primaryColor,
            fontSize: 16,
            fontFamily: "SF_Compact_Display_SemiBold",
          },

          primaryColor20SemiBold: {
            color: colors.primaryColor,
            fontSize: 20,
            fontFamily: "SF_Compact_Display_SemiBold",
          },

          primaryColor22SemiBold: {
            color: colors.primaryColor,
            fontSize: 22,
            fontFamily: "SF_Compact_Display_SemiBold",
          },

          primaryColor14Bold: {
            color: colors.primaryColor,
            fontSize: 14,
            fontFamily: "SF_Compact_Display_Bold",
          },

          whiteColor14Regular: {
            color: colors.whiteColor,
            fontSize: 14,
            fontFamily: "SF_Compact_Display_Regular",
          },

          whiteColor16Regular: {
            color: colors.whiteColor,
            fontSize: 16,
            fontFamily: "SF_Compact_Display_Regular",
          },

          whiteColor22Regular: {
            color: colors.whiteColor,
            fontSize: 22,
            fontFamily: "SF_Compact_Display_Regular",
          },

          whiteColor30Regular: {
            color: colors.whiteColor,
            fontSize: 30,
            fontFamily: "SF_Compact_Display_Regular",
          },

          whiteColor12Medium: {
            color: colors.whiteColor,
            fontSize: 12,
            fontFamily: "SF_Compact_Display_Medium",
          },

          whiteColor14Medium: {
            color: colors.whiteColor,
            fontSize: 14,
            fontFamily: "SF_Compact_Display_Medium",
          },

          whiteColor16Medium: {
            color: colors.whiteColor,
            fontSize: 16,
            fontFamily: "SF_Compact_Display_Medium",
          },

          whiteColor18Medium: {
            color: colors.whiteColor,
            fontSize: 18,
            fontFamily: "SF_Compact_Display_Medium",
          },

          whiteColor14SemiBold: {
            color: colors.whiteColor,
            fontSize: 14,
            fontFamily: "SF_Compact_Display_SemiBold",
          },

          whiteColor16SemiBold: {
            color: colors.whiteColor,
            fontSize: 16,
            fontFamily: "SF_Compact_Display_SemiBold",
          },

          whiteColor18SemiBold: {
            color: colors.whiteColor,
            fontSize: 18,
            fontFamily: "SF_Compact_Display_SemiBold",
          },

          whiteColor20SemiBold: {
            color: colors.whiteColor,
            fontSize: 20,
            fontFamily: "SF_Compact_Display_SemiBold",
          },

          whiteColor22SemiBold: {
            color: colors.whiteColor,
            fontSize: 22,
            fontFamily: "SF_Compact_Display_SemiBold",
          },

          whiteColor26SemiBold: {
            color: colors.whiteColor,
            fontSize: 26,
            fontFamily: "SF_Compact_Display_SemiBold",
          },

          whiteColor16Bold: {
            color: colors.whiteColor,
            fontSize: 16,
            fontFamily: "SF_Compact_Display_Bold",
          },

          whiteColor20Bold: {
            color: colors.whiteColor,
            fontSize: 20,
            fontFamily: "SF_Compact_Display_Bold",
          },

          whiteColor22Bold: {
            color: colors.whiteColor,
            fontSize: 22,
            fontFamily: "SF_Compact_Display_Bold",
          },

          greenColor14Medium: {
            color: colors.greenColor,
            fontSize: 14,
            fontFamily: "SF_Compact_Display_Medium",
          },
        },
        Sizes: {
          fixPadding: 10.0,
        },
      },
    });
  },
}));

export default useLocalData;
