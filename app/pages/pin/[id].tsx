import PlaceDetail from '@/components/place-detail';
import { useBottomNavigationStore } from '@/stores/bottom-navigation-store';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

export default function PinDetailScreen() {
  const setVisible = useBottomNavigationStore((state) => state.setVisible);
  const params = useLocalSearchParams();

  useEffect(() => {
    return () => {
      setVisible(true);
    };
  }, [setVisible]);

  // Extract name and coordinates from params if available
  const name = params.name as string | undefined;
  const latitude = params.latitude
    ? parseFloat(params.latitude as string)
    : undefined;
  const longitude = params.longitude
    ? parseFloat(params.longitude as string)
    : undefined;

  console.log('name', name);
  console.log('latitude', latitude);
  console.log('longitude', longitude);

  return (
    <PlaceDetail
      name={name}
      coordinates={
        latitude !== undefined && longitude !== undefined
          ? { latitude, longitude }
          : undefined
      }
    />
  );
}
