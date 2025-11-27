import { ActionButtons } from '@/components/place-detail/action-buttons';
import { AspectRatingsSection } from '@/components/place-detail/aspect-ratings-section';
import { DescriptionSection } from '@/components/place-detail/description-section';
import { EngagementSection } from '@/components/place-detail/engagement-section';
import { HeroSection } from '@/components/place-detail/hero-section';
import {
  MustKnowsBottomSheet,
  MustKnowsBottomSheetRef,
} from '@/components/place-detail/must-knows-bottom-sheet';
import { MustKnowsSection } from '@/components/place-detail/must-knows-section';
import { PlaceHeader } from '@/components/place-detail/place-header';
import { RatingSection } from '@/components/place-detail/rating-section';
import PlaceDetailSkeleton from '@/components/place-detail/skeleton';
import { TagsSection } from '@/components/place-detail/tags-section';
import { VisitHistorySection } from '@/components/place-detail/visit-history-section';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { usePin } from '@/hooks/use-pin';
import { useBottomNavigationStore } from '@/stores/bottom-navigation-store';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PlaceDetail() {
  const setVisible = useBottomNavigationStore((state) => state.setVisible);
  useEffect(() => {
    setVisible(false);
  }, [setVisible]);

  const params = useLocalSearchParams();
  const pinId = params.id as string;
  const insets = useSafeAreaInsets();
  const { data: pin, isLoading } = usePin(pinId);
  const bottomSheetRef = useRef<MustKnowsBottomSheetRef>(null);
  const [mustKnowVotes, setMustKnowVotes] = useState<
    Record<string, 'up' | 'down' | null>
  >({});

  const handleOpenMustKnowsSheet = useCallback(() => {
    // bottomSheetRef.current?.present();
    bottomSheetRef.current?.present();
  }, []);

  const handleVote = useCallback((mustKnowId: string, vote: 'up' | 'down') => {
    setMustKnowVotes((prev) => {
      const currentVote = prev[mustKnowId];
      if (currentVote === vote) {
        // Toggle off if clicking the same vote
        const newVotes = { ...prev };
        delete newVotes[mustKnowId];
        return newVotes;
      }
      return { ...prev, [mustKnowId]: vote };
    });
  }, []);

  if (isLoading || !pin) {
    return <PlaceDetailSkeleton insets={insets} />;
  }

  const formatLocationDetails = () => {
    const parts = [];
    if (pin.locationMetadata?.neighborhood) {
      parts.push(pin.locationMetadata.neighborhood);
    }
    if (pin.locationMetadata?.city) {
      parts.push(pin.locationMetadata.city);
    }
    if (pin.locationMetadata?.country) {
      parts.push(pin.locationMetadata.country);
    }
    return parts.join(' • ') || '';
  };

  // Mock aspect ratings - in real app, this would come from backend
  const aspectRatings = [
    { aspect: 'food_quality', value: 85 },
    { aspect: 'service', value: 70 },
    { aspect: 'atmosphere', value: 95 },
  ];

  // Mock images - in real app, this would come from pin.media or pin.images
  const images = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
  ];

  return (
    <>
      <ThemedView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ maxHeight: 400 }}>
            <HeroSection images={images} icon={pin.icon} color={pin.color} />
          </View>
          <View style={styles.contentSection}>
            {/* <HeroSection images={images} icon={pin.icon} color={pin.color} /> */}

            <PlaceHeader
              icon={pin.icon}
              color={pin.color}
              title={pin.title}
              address={pin.address}
              locationDetails={formatLocationDetails()}
            />

            <RatingSection rating={pin.rating} reviewCount={2183} />

            <ActionButtons />

            <EngagementSection createdBy={pin.createdBy} />

            <DescriptionSection description={pin.description} />

            <TagsSection tags={pin.tags} />

            <AspectRatingsSection aspectRatings={aspectRatings} />

            <VisitHistorySection visitCount={pin.visitCount} />

            <MustKnowsSection
              mustKnows={pin.mustKnows || []}
              mustKnowVotes={mustKnowVotes}
              onVote={handleVote}
              onSeeAll={handleOpenMustKnowsSheet}
            />
          </View>
        </ScrollView>

        {/* Bottom Sheet - moved outside ScrollView to fix rendering issues */}
        {/* Always render bottom sheet so ref is available, even if empty */}
      </ThemedView>
      <MustKnowsBottomSheet
        ref={bottomSheetRef}
        mustKnows={pin.mustKnows || []}
        mustKnowVotes={mustKnowVotes}
        onVote={handleVote}
      />
    </>
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
  contentSection: {
    padding: 20,
  },
});
