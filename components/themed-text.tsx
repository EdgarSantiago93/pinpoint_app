import { StyleSheet, Text, type TextProps } from 'react-native';

import {
  Colors,
  dmserif,
  nunito400regular,
  nunito600semibold,
  nunito700bold,
} from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | 'default'
    | 'title'
    | 'title-serif'
    | 'defaultSemiBold'
    | 'subtitle'
    | 'link'
    | 'dimmed';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = darkColor ?? Colors.light.text;

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'title-serif' ? styles.titleSerif : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'dimmed' ? styles.dimmed : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: nunito600semibold,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    fontFamily: nunito600semibold,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    // lineHeight: 32,
    fontFamily: nunito700bold,
  },
  titleSerif: {
    fontSize: 32,
    fontWeight: 'bold',
    // lineHeight: 32,
    fontFamily: dmserif,
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: nunito700bold,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
    fontFamily: nunito400regular,
  },
  dimmed: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666464',
    fontFamily: nunito400regular,
  },
});
