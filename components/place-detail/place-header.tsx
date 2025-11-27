import { PinIcons } from '@/components/pin-icons';
import { ThemedText } from '@/components/themed-text';
import { StyleSheet, View } from 'react-native';

interface PlaceHeaderProps {
  icon?: string;
  color?: string;
  title: string;
  address?: string;
  locationDetails?: string;
}

export function PlaceHeader({
  icon,
  color,
  title,
  address,
  locationDetails,
}: PlaceHeaderProps) {
  const iconData = icon
    ? PinIcons.find((iconItem) => iconItem.name === icon)
    : null;
  const IconComponent = iconData?.component || PinIcons[0].component;
  {
    /* <View
          style={[
            styles.iconContainer,
            { backgroundColor: color || Colors.light.tint },
          ]}
        >
          <IconComponent size={32} color="white" />
        </View> */
  }
  const formatAddress = () => {
    return address || 'No address available';
  };

  return (
    <>
      <View style={styles.nameSection}>
        <View style={styles.nameContainer}>
          <ThemedText type="title" style={styles.title}>
            {title}
          </ThemedText>
          <ThemedText type="dimmed" style={styles.address}>
            {formatAddress()}
          </ThemedText>
        </View>
      </View>

      {locationDetails && (
        <View style={styles.locationDetails}>
          <ThemedText type="dimmed" style={styles.locationText}>
            {locationDetails}
          </ThemedText>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  nameSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    flexShrink: 0,
  },
  nameContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    marginTop: 4,
  },
  locationDetails: {
    marginLeft: 72,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
  },
});
