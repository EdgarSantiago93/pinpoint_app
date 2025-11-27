import { apiRequest } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';

export type NearbyPin = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  color: string;
  icon: string;
};

interface UseNearbyPinsOptions {
  latitude: number;
  longitude: number;
  radius?: number; // in meters, default 5000
  limit?: number; // default 50
  enabled?: boolean;
}

export function useNearbyPins(options: UseNearbyPinsOptions) {
  const {
    latitude,
    longitude,
    radius = 5000,
    limit = 50,
    enabled = true,
  } = options;

  return useQuery({
    queryKey: ['nearbyPins', { latitude, longitude, radius, limit }],
    queryFn: async (): Promise<NearbyPin[]> => {
      const queryParams = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius: radius.toString(),
        limit: limit.toString(),
      });

      return apiRequest<NearbyPin[]>(`/pins/nearby?${queryParams.toString()}`);
    },
    enabled: enabled && !!latitude && !!longitude,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
