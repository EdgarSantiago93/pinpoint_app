import {
  renderStarIcons2,
  SkeletonStar,
} from '@/components/place-detail/renderStarIcons2';
import { ThemedText } from '@/components/themed-text';
import { FlexView } from '@/components/ui/flex-view';
import { StyleSheet, View } from 'react-native';

interface RatingSectionProps {
  rating?: number;
  reviewCount?: number;
  isLoading?: boolean;
}

export function RatingSection({
  rating,
  reviewCount,
  isLoading,
}: RatingSectionProps) {
  if (!rating) return null;

  return (
    <FlexView centerV gap={0}>
      <View style={styles.starsContainer}>
        {isLoading ? (
          <SkeletonStar starSize={20} />
        ) : (
          renderStarIcons2({ rating, starSize: 20 })
        )}
        {/* {renderStarIcons2({ rating, starSize: 20 })} */}
      </View>

      {isLoading ? null : (
        <ThemedText type="dimmed" style={styles.ratingText}>
          ({rating.toFixed(1)})
        </ThemedText>
      )}
    </FlexView>
  );
}

const styles = StyleSheet.create({
  starsContainer: {
    flexDirection: 'row',
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 0,
  },
});
