import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isLoading, checkAuthStatus } = useAuthStore();

  useEffect(() => {
    // Check auth status on mount
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    if (isLoading) {
      return; // Don't navigate while checking auth
    }

    const inAuthGroup = segments[0] === 'login';

    console.log(
      '🔵 AuthGuard - isAuthenticated:',
      isAuthenticated,
      'isLoading:',
      isLoading,
      'segments:',
      segments,
      'inAuthGroup:',
      inAuthGroup
    );

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated
      console.log('🔵 Redirecting to /login');
      router.replace('/login' as any);
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to pages if authenticated and on login page
      console.log('🔵 Redirecting to /pages');
      router.replace('/pages' as any);
    }
  }, [isAuthenticated, isLoading, segments, router]);

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <View
        style={[styles.container, { backgroundColor: Colors.light.background }]}
      >
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </View>
    );
  }

  // If not authenticated and not on login page, don't render children
  // (navigation will handle redirect)
  const inAuthGroup = segments[0] === 'login';
  if (!isAuthenticated && !inAuthGroup) {
    return null;
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
