import { PinIcons } from '@/components/pin-icons';
import { NearbyPin } from '@/hooks/use-nearby-pins';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Marker } from 'react-native-maps';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export const AnimatedPinMarker = ({
  pin,
  index,
  opacity = 1,
}: {
  pin: NearbyPin;
  index: number;
  opacity?: number;
}) => {
  const iconData = PinIcons.find((icon) => icon.name === pin.icon);
  const IconComponent = iconData?.component || PinIcons[0].component;
  const opacityValue = useSharedValue(opacity);

  useEffect(() => {
    opacityValue.value = withTiming(opacity, { duration: 200 });
  }, [opacity, opacityValue]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacityValue.value,
  }));

  const handlePress = () => {
    // console.log('onPress', pin.id);
    router.push(`/pages/pin/${pin.id}` as any);
  };
  return (
    <Marker
      key={pin.id}
      coordinate={{
        latitude: pin.latitude,
        longitude: pin.longitude,
      }}
      onPress={handlePress}
    >
      <Animated.View
        entering={FadeInDown.delay(index * 10)
          .duration(400)
          .springify()}
        style={animatedStyle}
      >
        <View
          style={{ backgroundColor: pin.color, padding: 10, borderRadius: 10 }}
        >
          <IconComponent size={24} color={'white'} />
        </View>
      </Animated.View>
    </Marker>
  );
};
