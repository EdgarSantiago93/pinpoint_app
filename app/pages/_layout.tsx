import { BottomNavigation } from '@/components/bottom-navigation';
import { useAddPlaceFormStore } from '@/stores/add-place-form-store';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

const animationOptions = {
  animation: 'fade',
  animationDuration: 150,
};

export default function PagesLayout() {
  const resetFormData = useAddPlaceFormStore((state) => state.resetFormData);

  useEffect(() => {
    resetFormData();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="map" options={animationOptions as any} />
        <Stack.Screen name="feed" options={animationOptions as any} />
        <Stack.Screen name="bookmarks" options={animationOptions as any} />
        <Stack.Screen name="profile" options={animationOptions as any} />
        <Stack.Screen
          name="pin/[id]"

          // options={{
          //   animation: 'slide_from_right',
          //   // animationDuration: 250,
          // }}
        />
        <Stack.Screen
          name="add-place"
          options={{
            animation: 'slide_from_bottom',
            animationDuration: 250,
            gestureEnabled: false,
          }}
        />
      </Stack>
      <BottomNavigation />
    </View>
  );
}
