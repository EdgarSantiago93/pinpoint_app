import { useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated, { EntryOrExitLayoutType } from 'react-native-reanimated';

export function FlexView({
  children,
  style,
  centerV = false,
  centerH = false,
  animated = false,
  entering,
  exiting,
  gap = 4,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  centerV?: boolean;
  centerH?: boolean;
  animated?: boolean;
  entering?: EntryOrExitLayoutType;
  exiting?: EntryOrExitLayoutType;
  gap?: number;
}) {
  const baseStyle = useMemo(() => {
    return {
      flexDirection: 'row',
      gap: gap,
      alignItems: centerV ? 'center' : 'flex-start',
      justifyContent: centerH ? 'center' : 'flex-start',
    };
  }, [centerV, centerH, gap]);
  if (animated) {
    return (
      <Animated.View
        style={[baseStyle as any, style]}
        entering={entering}
        exiting={exiting}
      >
        {children}
      </Animated.View>
    );
  }
  return <View style={[baseStyle as any, style]}>{children}</View>;
}
