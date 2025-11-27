import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/stores/auth-store';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
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
      } else {
        router.replace('/login' as any);
      }
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors.light.background }]}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/media/logo.png')}
            style={styles.logo}
            contentFit="contain"
          />
          <ThemedText type="title-serif" style={styles.title}>
            Pinpoint
          </ThemedText>
        </View>
        <ActivityIndicator
          size="large"
          color={Colors.light.tint}
          style={styles.spinner}
        />
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
  logoContainer: {
    marginBottom: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 48,
  },
  spinner: {
    marginTop: 32,
  },
});
