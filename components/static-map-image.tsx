import { PinIcons } from '@/components/pin-icons';
import { buildStaticMapUrl } from '@/utils/utils';
import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const StaticMapImage = ({
  latitude,
  longitude,
  icon: iconProp,
  color,
  onPress,
}: {
  latitude: number;
  longitude: number;
  icon: string;
  color: string;
  onPress: () => void;
}) => {
  const iconData = PinIcons.find((icon) => icon.name === iconProp);
  const IconComponent = iconData?.component || PinIcons[0].component;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={1}>
      <View style={styles.mapImageContainer}>
        <Image
          source={{
            uri: buildStaticMapUrl(latitude || 0, longitude || 0),
          }}
          style={styles.mapImage}
        />

        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <IconComponent size={24} color="white" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],

    borderRadius: 12,
    padding: 8,
  },
  mapImageContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapImage: {
    width: '90%',
    height: 177,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default StaticMapImage;
