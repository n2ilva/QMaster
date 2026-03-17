import { useRef, type ReactNode } from 'react';
import { Animated, Platform, Pressable, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { QUIZ_COLORS } from '@/constants/quiz-ui';

type InteractiveCardProps = {
  accentColor: string;
  hoverAccentColor?: string;
  children: ReactNode | ((state: { hovered: boolean; pressed: boolean }) => ReactNode);
  onPress?: PressableProps['onPress'];
  outerRadius?: number;
  innerRadius?: number;
  innerPadding?: number;
  scaleTo?: number;
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
};

export function InteractiveCard({
  accentColor,
  hoverAccentColor,
  children,
  onPress,
  outerRadius = 14,
  innerRadius = 12,
  innerPadding = 16,
  scaleTo = 1.03,
  style,
  innerStyle,
}: InteractiveCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const hoveredRef = useRef(false);
  const pressedRef = useRef(false);

  function animateScale(nextScale: number) {
    Animated.spring(scaleAnim, {
      toValue: nextScale,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  }

  function syncScale() {
    animateScale(hoveredRef.current || pressedRef.current ? scaleTo : 1);
  }

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => {
        hoveredRef.current = true;
        syncScale();
      }}
      onHoverOut={() => {
        hoveredRef.current = false;
        syncScale();
      }}
      onPressIn={() => {
        pressedRef.current = true;
        syncScale();
      }}
      onPressOut={() => {
        pressedRef.current = false;
        syncScale();
      }}>
      {({ hovered, pressed }) => (
        <Animated.View style={[style, { transform: [{ scale: scaleAnim }] }]}> 
          <View
            style={{
              backgroundColor: hovered ? (hoverAccentColor ?? QUIZ_COLORS.accentHover) : accentColor,
              borderRadius: outerRadius,
              padding: 2,
              overflow: 'hidden',
              ...(Platform.OS === 'web' && {
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }),
            }}>
            <View
              style={[
                {
                  backgroundColor: pressed ? '#15181D' : hovered ? '#1A1D24' : QUIZ_COLORS.surfaceBase,
                  borderRadius: innerRadius,
                  padding: innerPadding,
                  ...(Platform.OS === 'web' && {
                    transition: 'background-color 0.2s ease',
                  }),
                },
                innerStyle,
              ]}>
              {typeof children === 'function' ? children({ hovered, pressed }) : children}
            </View>
          </View>
        </Animated.View>
      )}
    </Pressable>
  );
}