import { LoadingScreen } from '@/components/loading-screen';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';

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
    return <LoadingScreen />;
  }

  // If not authenticated and not on login page, don't render children
  // (navigation will handle redirect)
  const inAuthGroup = segments[0] === 'login';
  if (!isAuthenticated && !inAuthGroup) {
    return null;
  }

  return <>{children}</>;
}
