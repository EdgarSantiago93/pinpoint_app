import PlaceDetail from '@/components/place-detail';
import { useBottomNavigationStore } from '@/stores/bottom-navigation-store';
import { useEffect } from 'react';

export default function PinDetailScreen() {
  const setVisible = useBottomNavigationStore((state) => state.setVisible);
  useEffect(() => {
    return () => {
      setVisible(true);
    };
  }, [setVisible]);
  return <PlaceDetail />;
}
