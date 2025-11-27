import {
  login as loginApi,
  register as registerApi,
  UserResponse,
} from '@/utils/auth-api';
import { API_BASE_URL } from '@/utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  avatar?: string;
  pins?: number;
  collections?: number;
  visitCount?: number;
  wishlistCount?: number;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string,
    name?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  checkAuthStatus: () => Promise<void>;
  setUser: (user: User | null) => void;
  fetchUser: (options?: {
    pins?: boolean;
    collections?: boolean;
    visitCount?: boolean;
    wishlistCount?: boolean;
  }) => Promise<void>; // Add this line
}

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      isLoading: true,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          // Use the auth-api utility
          const data = await loginApi(email, password);
          const { user, accessToken, refreshToken } = data;

          // Store tokens securely
          await SecureStore.setItemAsync(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
          await SecureStore.setItemAsync(
            TOKEN_KEYS.REFRESH_TOKEN,
            refreshToken
          );

          // Store user data in AsyncStorage (less sensitive)
          await AsyncStorage.setItem(
            TOKEN_KEYS.USER_DATA,
            JSON.stringify(user)
          );

          set({
            isAuthenticated: true,
            user,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (
        email: string,
        username: string,
        password: string,
        name?: string
      ) => {
        try {
          set({ isLoading: true });
          // Use the auth-api utility
          const data = await registerApi(email, username, password, name);
          const { user, accessToken, refreshToken } = data;

          // Store tokens securely
          await SecureStore.setItemAsync(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
          await SecureStore.setItemAsync(
            TOKEN_KEYS.REFRESH_TOKEN,
            refreshToken
          );

          // Store user data in AsyncStorage (less sensitive)
          await AsyncStorage.setItem(
            TOKEN_KEYS.USER_DATA,
            JSON.stringify(user)
          );

          set({
            isAuthenticated: true,
            user,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          // Clear tokens
          await SecureStore.deleteItemAsync(TOKEN_KEYS.ACCESS_TOKEN);
          await SecureStore.deleteItemAsync(TOKEN_KEYS.REFRESH_TOKEN);
          await AsyncStorage.removeItem(TOKEN_KEYS.USER_DATA);

          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
        } catch (error) {
          console.error('Logout error:', error);
          // Even if there's an error, clear the state
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
        }
      },

      refreshAccessToken: async (): Promise<boolean> => {
        try {
          const refreshToken = await SecureStore.getItemAsync(
            TOKEN_KEYS.REFRESH_TOKEN
          );

          if (!refreshToken) {
            return false;
          }

          const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (!response.ok) {
            return false;
          }

          const data = await response.json();
          const { accessToken, refreshToken: newRefreshToken } = data;

          // Update tokens
          await SecureStore.setItemAsync(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
          await SecureStore.setItemAsync(
            TOKEN_KEYS.REFRESH_TOKEN,
            newRefreshToken
          );

          return true;
        } catch (error) {
          console.error('Refresh token error:', error);
          return false;
        }
      },

      checkAuthStatus: async () => {
        try {
          set({ isLoading: true });

          const accessToken = await SecureStore.getItemAsync(
            TOKEN_KEYS.ACCESS_TOKEN
          );
          const userData = await AsyncStorage.getItem(TOKEN_KEYS.USER_DATA);

          if (!accessToken || !userData) {
            set({
              isAuthenticated: false,
              user: null,
              isLoading: false,
            });
            return;
          }

          // Try to get user info to verify token is still valid
          try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });

            if (response.ok) {
              const user = await response.json();
              set({
                isAuthenticated: true,
                user,
                isLoading: false,
              });
              // Update stored user data
              await AsyncStorage.setItem(
                TOKEN_KEYS.USER_DATA,
                JSON.stringify(user)
              );
            } else if (response.status === 401) {
              // Token expired, try to refresh
              const refreshed = await get().refreshAccessToken();
              if (refreshed) {
                // Retry getting user info
                const retryResponse = await fetch(`${API_BASE_URL}/auth/me`, {
                  method: 'GET',
                  headers: {
                    Authorization: `Bearer ${await SecureStore.getItemAsync(TOKEN_KEYS.ACCESS_TOKEN)}`,
                  },
                });
                if (retryResponse.ok) {
                  const user = await retryResponse.json();
                  set({
                    isAuthenticated: true,
                    user,
                    isLoading: false,
                  });
                  await AsyncStorage.setItem(
                    TOKEN_KEYS.USER_DATA,
                    JSON.stringify(user)
                  );
                } else {
                  // Refresh failed, logout
                  await get().logout();
                }
              } else {
                // Refresh failed, logout
                await get().logout();
              }
            } else {
              // Other error, logout
              await get().logout();
            }
          } catch (error) {
            console.error('Check auth status error:', error);
            // If we have stored user data, use it temporarily
            if (userData) {
              try {
                const user = JSON.parse(userData);
                set({
                  isAuthenticated: true,
                  user,
                  isLoading: false,
                });
              } catch {
                await get().logout();
              }
            } else {
              await get().logout();
            }
          }
        } catch (error) {
          console.error('Check auth status error:', error);
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
        }
      },

      setUser: (user: User | null) => {
        set({ user });
        if (user) {
          AsyncStorage.setItem(TOKEN_KEYS.USER_DATA, JSON.stringify(user));
        }
      },
      fetchUser: async (options?: {
        pins?: boolean;
        collections?: boolean;
        visitCount?: boolean;
        wishlistCount?: boolean;
      }) => {
        try {
          // Build query string from options
          const queryParams = new URLSearchParams(
            Object.fromEntries(
              Object.entries(options || {})
                .filter(([_, value]) => value === true)
                .map(([key, value]) => [key, value.toString()])
            )
          );

          // Use apiRequest which handles 401 and token refresh automatically
          // This ensures consistent error handling and automatic logout on session failure
          const { apiRequest } = await import('@/utils/api');
          const user = await apiRequest<UserResponse>(
            `/auth/me${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
          );

          console.log('retrieveduser', user);

          // Update the store and AsyncStorage
          set({ user });
          await AsyncStorage.setItem(
            TOKEN_KEYS.USER_DATA,
            JSON.stringify(user)
          );
        } catch (error) {
          console.error('Fetch user error:', error);

          // Check if user was logged out (session expired)
          // If so, don't throw - AuthGuard will handle redirect
          const { isAuthenticated } = get();
          if (!isAuthenticated) {
            // User was logged out, redirect is happening - don't throw error
            // This prevents the React Native error screen
            console.log('User logged out, redirecting to login...');
            return;
          }

          // For other errors, rethrow so component can handle it
          throw error;
        }
      },
    }),

    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
