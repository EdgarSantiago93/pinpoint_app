import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import {
  IconChefHatFilled,
  IconMapPin,
  IconMusic,
  IconStar,
  IconUsers,
} from '@tabler/icons-react-native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

// Aspect mapping for ratings
const aspectLabels: Record<
  string,
  {
    label: string;
    Icon: React.ComponentType<{ size?: number; color?: string }>;
  }
> = {
  food_quality: { label: 'Calidad de la comida', Icon: IconChefHatFilled },
  service: { label: 'Servicio', Icon: IconUsers },
  atmosphere: { label: 'Ambiente', Icon: IconMusic },
  cleanliness: { label: 'Limpieza', Icon: IconMapPin },
  value: { label: 'Precio-Calidad', Icon: IconStar },
};

interface AspectRating {
  aspect: string;
  value: number;
}

interface AspectRatingsSectionProps {
  aspectRatings: AspectRating[];
}

export function AspectRatingsSection({
  aspectRatings,
}: AspectRatingsSectionProps) {
  if (aspectRatings.length === 0) return null;

  return (
    <View style={styles.aspectsSection}>
      <View style={styles.aspectsHeader}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Qué fue mas importante para ti?
        </ThemedText>
        <TouchableOpacity>
          <ThemedText style={styles.infoIcon}>ⓘ</ThemedText>
        </TouchableOpacity>
      </View>
      <View style={styles.aspectsList}>
        {aspectRatings.map((item) => {
          const aspectInfo = aspectLabels[item.aspect] || {
            label: item.aspect,
            Icon: IconStar,
          };
          const AspectIcon = aspectInfo.Icon;
          return (
            <View key={item.aspect} style={styles.aspectItem}>
              <View style={styles.aspectIconContainer}>
                <AspectIcon size={20} color={Colors.light.tint} />
              </View>
              <View style={styles.aspectContent}>
                <View style={styles.aspectHeader}>
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.aspectLabel}
                  >
                    {aspectInfo.label}
                  </ThemedText>
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.aspectValue}
                  >
                    {item.value}%
                  </ThemedText>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${item.value}%`,
                        backgroundColor: Colors.light.tint,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  aspectsSection: {
    marginBottom: 32,
  },
  aspectsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  infoIcon: {
    fontSize: 18,
    color: Colors.light.icon,
  },
  aspectsList: {
    gap: 16,
  },
  aspectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  aspectIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FFF4F2',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  aspectContent: {
    flex: 1,
  },
  aspectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  aspectLabel: {
    fontSize: 14,
  },
  aspectValue: {
    fontSize: 14,
    color: Colors.light.tint,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});

