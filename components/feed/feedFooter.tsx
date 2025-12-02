import { renderStarIcons } from '@/components/place-detail/renderStarIcons';
import RevisitIcon from '@/components/revisit-icon';
import { ThemedText } from '@/components/themed-text';
import { FlexView } from '@/components/ui/flex-view';
import { Colors, nunito600semibold } from '@/constants/theme';
import { IconBookmark } from '@tabler/icons-react-native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const FeedFooter = ({
  post,
  rating,
  showVisitBadge = true,
  showRating = true,
}: any) => {
  return (
    <FlexView
      style={{
        justifyContent:
          showVisitBadge && showRating ? 'space-between' : 'flex-end',
        alignItems: 'center',
      }}
      centerV
    >
      {showVisitBadge ? (
        <View style={styles.visitBadge}>
          <RevisitIcon size={18} color={'#E3655B'} />
          <ThemedText style={styles.visitBadgeText}>
            {post.visitCount} {post.visitCount === 1 ? 'visita' : 'visitas'}
          </ThemedText>
        </View>
      ) : showRating ? (
        <View style={styles.starsContainer}>
          {renderStarIcons({ rating: post.place?.rating || 0 })}
          <ThemedText type="dimmed" style={styles.ratingText}>
            ({post.place?.rating})
          </ThemedText>
        </View>
      ) : null}

      <TouchableOpacity>
        <IconBookmark size={24} color={Colors.light.icon} />
      </TouchableOpacity>
    </FlexView>
  );
};

export default FeedFooter;

const styles = StyleSheet.create({
  ratingText: {
    fontSize: 12,
    fontFamily: nunito600semibold,
    color: '#666464',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  visitBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E3655B1A', // 10% opacity
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  visitBadgeText: {
    fontSize: 12,
    fontFamily: nunito600semibold,
    color: '#E3655B',
  },
});
