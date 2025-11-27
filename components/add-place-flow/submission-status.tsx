import { Colors } from '@/constants/theme';
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons-react-native';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface SubmissionStatusProps {
  isSubmitting: boolean;
  isSuccess?: boolean;
  isError?: boolean;
}

export function SubmissionStatus({
  isSubmitting,
  isSuccess,
  isError,
}: SubmissionStatusProps) {
  const loaderOpacity = useSharedValue(1);
  const iconOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0.5);

  useEffect(() => {
    if (!isSubmitting) {
      // Fade out loader
      loaderOpacity.value = withTiming(0, { duration: 300 });
      // Fade in icon
      iconOpacity.value = withTiming(1, { duration: 300 });
      iconScale.value = withTiming(1, { duration: 300 });
    } else {
      // Reset when submitting
      loaderOpacity.value = 1;
      iconOpacity.value = 0;
      iconScale.value = 0.5;
    }
  }, [isSubmitting, loaderOpacity, iconOpacity, iconScale]);

  const loaderStyle = useAnimatedStyle(() => ({
    opacity: loaderOpacity.value,
    position: loaderOpacity.value === 0 ? 'absolute' : 'relative',
  }));

  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

  const colors = Colors['light'];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, loaderStyle]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </Animated.View>
      {(isSuccess || isError) && (
        <Animated.View style={[styles.content, iconStyle]}>
          {isSuccess ? (
            <IconCircleCheck
              size={64}
              color={'rgb(47, 190, 57)'}
              strokeWidth={2}
            />
          ) : (
            <IconAlertCircle
              size={64}
              color={'rgb(231, 76, 60)'}
              strokeWidth={2}
            />
          )}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
