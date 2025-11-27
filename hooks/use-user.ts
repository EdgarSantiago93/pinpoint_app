import { useAuthStore } from '@/stores/auth-store';
import { apiRequest } from '@/utils/api';
import { UserResponse } from '@/utils/auth-api';
import { useQuery } from '@tanstack/react-query';

interface UseUserOptions {
  pins?: boolean;
  collections?: boolean;
  visitCount?: boolean;
  wishlistCount?: boolean;
  enabled?: boolean;
}

export function useUser(options: UseUserOptions = {}) {
  const {
    pins,
    collections,
    visitCount,
    wishlistCount,
    enabled = true,
  } = options;
  const setUser = useAuthStore((state) => state.setUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['user', { pins, collections, visitCount, wishlistCount }],
    queryFn: async () => {
      // Build query string from options
      const queryParams = new URLSearchParams(
        Object.fromEntries(
          Object.entries({ pins, collections, visitCount, wishlistCount })
            .filter(([_, value]) => value === true)
            .map(([key, value]) => [key, value?.toString() ?? 'true'])
        )
      );

      const user = await apiRequest<UserResponse>(
        `/auth/me${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      );

      // Update the auth store with the fetched user
      setUser(user);

      return user;
    },
    enabled: enabled && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}
