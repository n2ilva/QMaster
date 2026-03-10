import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";

import { useScreenSize } from "./use-screen-size";

const WEB_FIXED_TAB_BAR_HEIGHT = 80;

/**
 * Returns the correct bottom padding for tab screen content.
 * On web the tab bar uses position:fixed, so useBottomTabBarHeight() may
 * return 0. This hook guarantees at least WEB_FIXED_TAB_BAR_HEIGHT pixels
 * of clearance on web (mobile/tablet).
 * On desktop, the tab bar is hidden (sidebar is used instead), so returns
 * only the extra padding.
 */
export function useTabContentPadding(extra = 24): number {
  const tabBarHeight = useBottomTabBarHeight();
  const { isDesktop } = useScreenSize();

  if (isDesktop) {
    return extra;
  }

  if (Platform.OS === "web") {
    return Math.max(tabBarHeight, WEB_FIXED_TAB_BAR_HEIGHT) + extra;
  }

  return tabBarHeight + extra;
}
