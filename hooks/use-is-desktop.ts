import { useScreenSize } from "./use-screen-size";

/**
 * @deprecated Use `useScreenSize()` instead for Desktop / Tablet / Mobile support.
 */
export function useIsDesktop(): boolean {
  const { isDesktop } = useScreenSize();
  return isDesktop;
}
