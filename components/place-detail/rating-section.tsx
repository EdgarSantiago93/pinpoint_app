import { renderStarIcons } from '@/components/place-detail/renderStarIcons';
import { ThemedText } from '@/components/themed-text';
import { StyleSheet, View } from 'react-native';

interface RatingSectionProps {
  rating?: number;
  reviewCount?: number;
}

export function RatingSection({ rating, reviewCount }: RatingSectionProps) {
  if (!rating) return null;

  return (
    <View style={styles.ratingSection}>
      <View style={styles.starsContainer}>
        {renderStarIcons(rating)}
      </View>
      <ThemedText type="dimmed" style={styles.ratingText}>
        {rating.toFixed(1)} ({reviewCount || 0} reviews)
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 72,
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 8,
  },
});

