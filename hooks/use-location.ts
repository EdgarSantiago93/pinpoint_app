import * as Location from 'expo-location';
import { useState } from 'react';

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export function useLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const requestPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === 'granted');
      return status === 'granted';
    } catch (err) {
      setError('Failed to request location permission');
      setHasPermission(false);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if we have permission
      const { status } = await Location.getForegroundPermissionsAsync();

      if (status !== 'granted') {
        const granted = await requestPermission();
        if (!granted) {
          setError('Location permission denied');
          setLoading(false);
          return null;
        }
      }

      // Get current position
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const userLocation: UserLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy || undefined,
      };

      setLocation(userLocation);
      setLoading(false);
      return userLocation;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to get location';
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  return {
    location,
    loading,
    error,
    hasPermission,
    getCurrentLocation,
    requestPermission,
  };
}
