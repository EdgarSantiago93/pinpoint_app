import { ThemedView } from '@/components/themed-view';
import { Colors, nunito400regular } from '@/constants/theme';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

// Skeleton Loader Component
const SkeletonBox = ({
  width,
  height,
  borderRadius = 8,
  style,
}: {
  width?: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
}) => {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1500 }), -1, false);
  }, [shimmer]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: 0.3 + shimmer.value * 0.3,
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: width || '100%',
          height,
          borderRadius,
          backgroundColor: '#E0E0E0',
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

export default function PlaceDetailSkeleton({
  insets,
}: {
  insets: { top: number; bottom: number };
}) {
  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image Skeleton */}
        <View style={styles.heroSection}>
          <SkeletonBox height={320} borderRadius={0} />
          {/* Overlay Navigation */}
          <View style={[styles.heroOverlay, { paddingTop: insets.top + 10 }]}>
            <View style={styles.overlayButton}>
              <SkeletonBox width={24} height={24} borderRadius={12} />
            </View>
            <View style={styles.overlayRight}>
              <View style={styles.overlayButton}>
                <SkeletonBox width={24} height={24} borderRadius={12} />
              </View>
              <View style={styles.overlayButton}>
                <SkeletonBox width={24} height={24} borderRadius={12} />
              </View>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Icon and Name Skeleton */}
          <View style={styles.nameSection}>
            <SkeletonBox width={56} height={56} borderRadius={28} />
            <View style={[styles.nameContainer, { gap: 8 }]}>
              <SkeletonBox width="80%" height={28} borderRadius={4} />
              <SkeletonBox width="60%" height={16} borderRadius={4} />
            </View>
          </View>

          {/* Location Details Skeleton */}
          <View style={styles.locationDetails}>
            <SkeletonBox width="50%" height={14} borderRadius={4} />
          </View>

          {/* Rating Skeleton */}
          <View style={styles.ratingSection}>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((i) => (
                <SkeletonBox key={i} width={20} height={20} borderRadius={10} />
              ))}
            </View>
            <SkeletonBox
              width={120}
              height={14}
              borderRadius={4}
              style={{ marginLeft: 8 }}
            />
          </View>

          {/* Action Buttons Skeleton */}
          <View style={styles.actionButtons}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.actionButton}>
                <SkeletonBox width={24} height={24} borderRadius={12} />
                <SkeletonBox width={50} height={12} borderRadius={4} />
              </View>
            ))}
          </View>

          {/* Engagement Section Skeleton */}
          <View style={styles.engagementSection}>
            <SkeletonBox
              width="40%"
              height={14}
              borderRadius={4}
              style={{ marginBottom: 12 }}
            />
            <View style={styles.likesSection}>
              <View style={styles.avatarContainer}>
                {[1, 2, 3].map((i) => (
                  <SkeletonBox
                    key={i}
                    width={32}
                    height={32}
                    borderRadius={16}
                  />
                ))}
              </View>
              <SkeletonBox width={150} height={14} borderRadius={4} />
            </View>
          </View>

          {/* Description Skeleton */}
          <View style={styles.descriptionSection}>
            <SkeletonBox
              width="100%"
              height={16}
              borderRadius={4}
              style={{ marginBottom: 8 }}
            />
            <SkeletonBox
              width="100%"
              height={16}
              borderRadius={4}
              style={{ marginBottom: 8 }}
            />
            <SkeletonBox width="70%" height={16} borderRadius={4} />
          </View>

          {/* Tags Skeleton */}
          <View style={styles.tagsSection}>
            <SkeletonBox
              width={80}
              height={20}
              borderRadius={4}
              style={{ marginBottom: 16 }}
            />
            <View style={styles.tagsContainer}>
              {[1, 2, 3, 4, 5].map((i) => (
                <SkeletonBox
                  key={i}
                  width={80 + i * 20}
                  height={32}
                  borderRadius={20}
                />
              ))}
            </View>
          </View>

          {/* Aspect Ratings Skeleton */}
          <View style={styles.aspectsSection}>
            <View style={styles.aspectsHeader}>
              <SkeletonBox width={200} height={20} borderRadius={4} />
              <SkeletonBox width={18} height={18} borderRadius={9} />
            </View>
            <View style={styles.aspectsList}>
              {[1, 2, 3].map((i) => (
                <View key={i} style={styles.aspectItem}>
                  <SkeletonBox width={40} height={40} borderRadius={8} />
                  <View style={styles.aspectContent}>
                    <View style={styles.aspectHeader}>
                      <SkeletonBox width={120} height={14} borderRadius={4} />
                      <SkeletonBox width={40} height={14} borderRadius={4} />
                    </View>
                    <SkeletonBox
                      width="100%"
                      height={6}
                      borderRadius={3}
                      style={{ marginTop: 4 }}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Visit History Skeleton */}
          <View style={styles.visitHistorySection}>
            <SkeletonBox
              width={120}
              height={20}
              borderRadius={4}
              style={{ marginBottom: 16 }}
            />
            <View style={styles.visitHistoryCard}>
              <View style={styles.visitHistoryContent}>
                <SkeletonBox width={24} height={24} borderRadius={12} />
                <View style={styles.visitHistoryText}>
                  <SkeletonBox
                    width={150}
                    height={14}
                    borderRadius={4}
                    style={{ marginBottom: 4 }}
                  />
                  <SkeletonBox width={100} height={12} borderRadius={4} />
                </View>
              </View>
              <SkeletonBox width={20} height={20} borderRadius={10} />
            </View>
          </View>

          {/* Must Knows Skeleton */}
          <View style={styles.mustKnowsSection}>
            <View style={styles.mustKnowsHeader}>
              <SkeletonBox width={100} height={20} borderRadius={4} />
              <SkeletonBox width={80} height={14} borderRadius={4} />
            </View>
            <View style={styles.mustKnowsGrid}>
              {[1, 2, 3, 4].map((i) => (
                <View key={i} style={styles.mustKnowCard}>
                  <SkeletonBox
                    width={42}
                    height={42}
                    borderRadius={4}
                    style={{ marginBottom: 8 }}
                  />
                  <SkeletonBox
                    width="100%"
                    height={14}
                    borderRadius={4}
                    style={{ marginBottom: 4 }}
                  />
                  <SkeletonBox
                    width="80%"
                    height={14}
                    borderRadius={4}
                    style={{ marginBottom: 8 }}
                  />
                  <View style={styles.mustKnowFooter}>
                    <SkeletonBox width={60} height={12} borderRadius={4} />
                    <View style={styles.voteButtons}>
                      <SkeletonBox width={20} height={20} borderRadius={4} />
                      <SkeletonBox width={20} height={20} borderRadius={4} />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    position: 'relative',
    height: 320,
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  overlayButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
    backdropFilter: 'blur(10px)',
  },
  overlayRight: {
    flexDirection: 'row',
    gap: 8,
  },
  imageCredit: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backdropFilter: 'blur(10px)',
  },
  imageCreditText: {
    color: 'white',
    fontSize: 12,
    fontFamily: nunito400regular,
  },
  contentSection: {
    padding: 20,
  },
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
  star: {
    marginRight: 2,
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    gap: 4,
  },
  favoriteButton: {
    backgroundColor: '#FFF4F2',
    borderColor: Colors.light.tint,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: nunito400regular,
    color: Colors.light.tint,
    fontWeight: '500',
  },
  actionButtonTextDark: {
    color: Colors.light.text,
  },
  engagementSection: {
    marginBottom: 24,
  },
  pinnedBy: {
    fontSize: 14,
    marginBottom: 12,
  },
  likesSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.light.background,
    marginLeft: -8,
  },
  avatar1: {
    backgroundColor: '#FF6B6B',
    zIndex: 3,
  },
  avatar2: {
    backgroundColor: '#4ECDC4',
    zIndex: 2,
  },
  avatar3: {
    backgroundColor: '#FFE66D',
    zIndex: 1,
  },
  likesText: {
    fontSize: 14,
  },
  descriptionSection: {
    marginBottom: 32,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: nunito400regular,
  },
  tagsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagButton: {
    backgroundColor: '#FFF4F2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${Colors.light.tint}80`,
  },
  tagText: {
    fontSize: 14,
    color: Colors.light.tint,
    fontFamily: nunito400regular,
    fontWeight: '500',
  },
  aspectsSection: {
    marginBottom: 32,
  },
  aspectsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  visitHistorySection: {
    marginBottom: 32,
  },
  visitHistoryCard: {
    backgroundColor: '#FFF4F2',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  visitHistoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  visitHistoryText: {
    gap: 4,
  },
  visitHistoryTitle: {
    fontSize: 14,
  },
  visitHistorySubtitle: {
    fontSize: 12,
  },
  mustKnowsSection: {
    marginBottom: 32,
  },
  mustKnowsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
  },
  mustKnowsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  allMustKnowsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  mustKnowCard: {
    flex: 1,
    minWidth: '45%',
    aspectRatio: 1,
    backgroundColor: '#FFF4F2',
    padding: 16,
    borderRadius: 12,
    justifyContent: 'space-between',
  },
  mustKnowText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: nunito400regular,
    flex: 1,
  },
  mustKnowFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  mustKnowAuthor: {
    fontSize: 12,
    flex: 1,
  },
  voteButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  voteButton: {
    padding: 4,
  },
  voteButtonActive: {
    backgroundColor: 'rgba(201, 71, 38, 0.1)',
    borderRadius: 4,
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  bottomSheetTitle: {
    fontSize: 24,
  },
  bottomSheetScroll: {
    flex: 1,
  },
  bottomSheetScrollContent: {
    paddingBottom: 20,
  },
});
