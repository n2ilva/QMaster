import { useEffect, useState } from "react";
import { Dimensions, Platform } from "react-native";

export type ScreenSize = "mobile" | "tablet" | "desktop";

const TABLET_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 1024;

function getScreenSize(width: number): ScreenSize {
  if (width >= DESKTOP_BREAKPOINT) return "desktop";
  if (width >= TABLET_BREAKPOINT) return "tablet";
  return "mobile";
}

export function useScreenSize() {
  const [screenSize, setScreenSize] = useState<ScreenSize>(() => {
    if (Platform.OS !== "web") return "mobile";
    return getScreenSize(Dimensions.get("window").width);
  });

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenSize(getScreenSize(window.width));
    });

    return () => subscription.remove();
  }, []);

  const isDesktop = screenSize === "desktop";
  const isTablet = screenSize === "tablet";
  const isMobile = screenSize === "mobile";

  return { screenSize, isDesktop, isTablet, isMobile };
}
