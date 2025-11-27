import { styles } from '@/components/pageComponents/profile/styles';
import { ThemedView } from '@/components/themed-view';
import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

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

export default function ProfileSkeleton() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView
        style={[
          styles.container,
          { paddingBottom: Math.max(insets.bottom, 20) + 80 },
        ]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Settings Button Skeleton */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <SkeletonBox width={24} height={24} borderRadius={12} />
          </View>

          {/* Profile Header Skeleton */}
          <View style={styles.profileHeader}>
            <SkeletonBox width={100} height={100} borderRadius={50} />
            <SkeletonBox
              width={200}
              height={28}
              borderRadius={4}
              style={{ marginTop: 8, marginBottom: 8 }}
            />
            <SkeletonBox width={120} height={16} borderRadius={4} />
          </View>

          {/* Stats Row Skeleton */}
          <View style={styles.statsContainer}>
            <SkeletonBox width={80} height={20} borderRadius={4} />
            <SkeletonBox width={100} height={20} borderRadius={4} />
          </View>

          {/* Action Cards Skeleton */}
          <View style={styles.cardsContainer}>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: '#F5F5F5',
                },
              ]}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardLeft}>
                  <SkeletonBox width={40} height={40} borderRadius={20} />
                  <View style={styles.cardTextContainer}>
                    <SkeletonBox width={60} height={14} borderRadius={4} />
                    <SkeletonBox width={40} height={18} borderRadius={4} />
                  </View>
                </View>
                <SkeletonBox width={18} height={18} borderRadius={9} />
              </View>
            </View>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: '#F5F5F5',
                },
              ]}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardLeft}>
                  <SkeletonBox width={40} height={40} borderRadius={20} />
                  <View style={styles.cardTextContainer}>
                    <SkeletonBox width={60} height={14} borderRadius={4} />
                    <SkeletonBox width={40} height={18} borderRadius={4} />
                  </View>
                </View>
                <SkeletonBox width={18} height={18} borderRadius={9} />
              </View>
            </View>
          </View>

          {/* Collections Section Skeleton */}
          <View style={styles.collectionsSection}>
            <SkeletonBox
              width={120}
              height={20}
              borderRadius={4}
              style={{ marginBottom: 16 }}
            />
            <View
              style={[
                styles.collectionCard,
                {
                  backgroundColor: '#F5F5F5',
                },
              ]}
            >
              <View
                style={[
                  styles.collectionImage,
                  {
                    backgroundColor: '#E0E0E0',
                    overflow: 'hidden',
                  },
                ]}
              >
                <SkeletonBox width="100%" height="100%" borderRadius={0} />
              </View>
              <SkeletonBox
                width={150}
                height={16}
                borderRadius={4}
                style={{ margin: 16 }}
              />
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

