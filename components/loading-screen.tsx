import { ThemedText } from '@/components/themed-text';
import { FlexView } from '@/components/ui/flex-view';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/stores/auth-store';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export function LoadingScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuthStatus } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/pages' as any);
        console.log('Redirecting to /pages');
      } else {
        router.replace('/login' as any);
        console.log('Redirecting to /login');
      }
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors.light.background }]}
    >
      <View style={styles.content}>
        <FlexView
          animated
          centerH
          centerV
          style={{ marginBottom: 32 }}
          entering={FadeInDown}
        >
          <Image
            source={require('@/assets/images/logo_shadow.png')}
            style={{ width: 65, height: 65 }}
            contentFit="contain"
          />
          <ThemedText type="title-serif" style={{ fontSize: 42 }}>
            Pinpoint
          </ThemedText>
        </FlexView>

        <Animated.View entering={FadeInDown.delay(300)}>
          <ActivityIndicator size={'small'} color={Colors.light.tint} />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
});
