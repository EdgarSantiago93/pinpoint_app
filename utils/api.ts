import { useAuthStore } from '@/stores/auth-store';
import { API_BASE_URL } from '@/utils/constants';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
import { refreshToken } from './auth-api';

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
};

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function getAccessToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(TOKEN_KEYS.ACCESS_TOKEN);
}

async function attemptTokenRefresh(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const refreshTokenValue = await SecureStore.getItemAsync(
        TOKEN_KEYS.REFRESH_TOKEN
      );

      if (!refreshTokenValue) {
        console.log('🟡 NO REFRESH TOKEN');
        console.log('🟡 NO REFRESH TOKEN');
        console.log('🟡 NO REFRESH TOKEN');
        console.log('🟡 NO REFRESH TOKEN');
        // No refresh token available - session is invalid, logout user
        const { logout } = useAuthStore.getState();
        await logout();
        return false;
      }

      const response = await refreshToken(refreshTokenValue);
      const { accessToken, refreshToken: newRefreshToken } = response;

      await SecureStore.setItemAsync(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
      await SecureStore.setItemAsync(TOKEN_KEYS.REFRESH_TOKEN, newRefreshToken);

      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Refresh token is invalid or expired - logout user
      // AuthGuard will automatically redirect to login when isAuthenticated becomes false
      const { logout } = useAuthStore.getState();
      await logout();
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<T> {
  const token = await getAccessToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized - try to refresh token
  if (response.status === 401 && retryCount === 0) {
    const refreshed = await attemptTokenRefresh();
    if (refreshed) {
      console.log('🟢 token REFRESHED');
      // Retry the original request with new token
      return apiRequest<T>(endpoint, options, retryCount + 1);
    } else {
      console.log('🔥 REFRESH FAILED');

      // router.replace('/login' as any);
      // Refresh failed - logout() was already called in attemptTokenRefresh
      // AuthGuard will automatically redirect to /login when isAuthenticated becomes false
      // Create a silent error that won't trigger error screens
      const error = new Error('Session expired - please login again');
      // Mark as handled to prevent error screen
      (error as any).isHandled = true;
      throw error;
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status}`,
    }));
    Toast.show({
      text1: error.message || `HTTP error! status: ${response.status}`,
      type: 'error',
    });
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}
