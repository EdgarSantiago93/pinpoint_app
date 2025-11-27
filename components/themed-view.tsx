import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  return (
    <View
      style={[{ backgroundColor: 'rbg(255, 247, 240)' }, style]}
      {...otherProps}
    />
  );
}
