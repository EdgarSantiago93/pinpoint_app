import Divider from '@/components/divider';
import { SkeletonBox } from '@/components/pageComponents/profile/skeleton';
import { AspectRatingsSection } from '@/components/place-detail/aspect-ratings-section';
import { DescriptionSection } from '@/components/place-detail/description-section';
import {
  DirectionsBottomSheet,
  DirectionsBottomSheetRef,
} from '@/components/place-detail/directions-bottom-sheet';
import { HeroSection } from '@/components/place-detail/hero-section';
import {
  MustKnowsBottomSheet,
  MustKnowsBottomSheetRef,
} from '@/components/place-detail/must-knows-bottom-sheet';
import { MustKnowsSection } from '@/components/place-detail/must-knows-section';
import { PlaceHeader } from '@/components/place-detail/place-header';
import { TagsSection } from '@/components/place-detail/tags-section';
import {
  VisitHistoryBottomSheet,
  VisitHistoryBottomSheetRef,
} from '@/components/place-detail/visit-history-bottom-sheet';
import { VisitHistorySection } from '@/components/place-detail/visit-history-section';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { usePin } from '@/hooks/use-pin';
import { useBottomNavigationStore } from '@/stores/bottom-navigation-store';
import { IconArrowLeft, IconMap2 } from '@tabler/icons-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PlaceDetail({
  name,
  coordinates,
}: {
  name: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}) {
  const setVisible = useBottomNavigationStore((state) => state.setVisible);
  useEffect(() => {
    setVisible(false);
  }, [setVisible]);

  const params = useLocalSearchParams();
  const pinId = params.id as string;
  const insets = useSafeAreaInsets();
  const { data: pin, refetch, isRefetching, isLoading } = usePin(pinId);
  const bottomSheetRef = useRef<MustKnowsBottomSheetRef>(null);
  const directionsBottomSheetRef = useRef<DirectionsBottomSheetRef>(null);
  const visitHistoryBottomSheetRef = useRef<VisitHistoryBottomSheetRef>(null);
  const [mustKnowVotes, setMustKnowVotes] = useState<
    Record<string, 'up' | 'down' | null>
  >({});

  const displayName = pin?.title || name || '';
  const displayCoordinates = coordinates;

  const handleRefresh = useCallback(() => {
    console.log('handleRefresh');
    console.log('refetch', isRefetching);
    refetch().then((res) => {
      console.log('refetch', isRefetching);
      console.log('refetch done', res);
    });
  }, [refetch, isRefetching]);

  const handleOpenMustKnowsSheet = useCallback(() => {
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

  const handleOpenVisitHistorySheet = useCallback(() => {
    visitHistoryBottomSheetRef.current?.present();
  }, []);

  // Mock aspect ratings - in real app, this would come from backend
  const aspectRatings = [
    { aspect: 'food_quality', value: 85 },
    { aspect: 'service', value: 70 },
    { aspect: 'atmosphere', value: 95 },
    { aspect: 'cleanliness', value: 95 },
    { aspect: 'value', value: 95 },
    // food_quality: { label: 'Calidad de la comida', Icon: IconChefHatFilled },
    // service: { label: 'Servicio', Icon: IconUsers },
    // atmosphere: { label: 'Ambiente', Icon: IconMusic },
    // cleanliness: { label: 'Limpieza', Icon: IconMapPin },
    // value: { label: 'Precio-Calidad', Icon: IconStar },
  ];

  // const [isLoading, setIsLoading] = useState(true);

  // Mock visit data - replace with real data when available
  const mockVisits = [
    {
      id: '1',
      visitedAt: new Date('2023-09-24'),
      description: 'Primera visita al lugar. Excelente experiencia.',
      status: 'completed' as const,
    },
    {
      id: '2',
      visitedAt: new Date('2023-10-15'),
      description: 'Segunda visita con amigos. Ambiente increíble.',
      status: 'completed' as const,
    },
    {
      id: '3',
      visitedAt: new Date(),
      description: 'Visita de hoy',
      status: 'pending' as const,
      isToday: true,
    },
  ];

  return (
    <>
      <ThemedView style={styles.container}>
        {isRefetching ? (
          <Animated.View
            entering={FadeInUp.duration(120).delay(200).springify()}
            exiting={FadeOutDown.duration(120).springify()}
            style={{
              width: 40,
              height: 40,
              position: 'absolute',
              top: insets.top,
              left: '50%',
              transform: [{ translateX: '-50%' }],
              zIndex: 1000,
              backgroundColor: Colors.light.tint,
              padding: 6,
              borderRadius: 10,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ActivityIndicator
              size={40}
              color={'white'}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: [{ translateX: '-35%' }, { translateY: '-35%' }],
              }}
            />
          </Animated.View>
        ) : null}
        <View style={[styles.heroOverlay, { paddingTop: insets.top }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.overlayButton}
          >
            <IconArrowLeft
              size={22}
              color={Colors.light.tint}
              strokeWidth={2.5}
            />
          </TouchableOpacity>
          {displayCoordinates && (
            <View style={styles.overlayRight}>
              <TouchableOpacity
                style={styles.overlayButton}
                onPress={() => directionsBottomSheetRef.current?.present()}
              >
                <IconMap2 size={22} color={Colors.light.tint} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              tintColor={Colors.light.tint}
              colors={[Colors.light.tint]}
              refreshing={isRefetching}
              onRefresh={handleRefresh}
            />
          }
        >
          <View style={{ maxHeight: 420 }}>
            <HeroSection
              images={pin?.media}
              icon={pin?.icon}
              color={pin?.color}
              latitude={displayCoordinates?.latitude}
              longitude={displayCoordinates?.longitude}
              isLoading={isLoading}
            />
          </View>

          <View style={styles.contentSection}>
            <PlaceHeader name={name} pin={pin} isLoading={isLoading} />

            {isLoading ? (
              <View style={{ gap: 5 }}>
                <SkeletonBox height={24} width={'100%'} />
                <SkeletonBox height={24} width={'100%'} />
                <SkeletonBox height={24} width={'70%'} />
              </View>
            ) : (
              <Animated.View
                entering={FadeInDown.duration(120).delay(200).springify()}
              >
                <DescriptionSection description={pin?.description} />
              </Animated.View>
            )}

            <Divider spacing={16} />

            <MustKnowsSection
              mustKnows={pin?.mustKnows || []}
              mustKnowVotes={mustKnowVotes}
              onVote={handleVote}
              onSeeAll={handleOpenMustKnowsSheet}
              isLoading={isLoading}
            />

            <AspectRatingsSection
              aspectRatings={aspectRatings}
              isLoading={isLoading}
            />

            <VisitHistorySection
              isLoading={isLoading}
              visitCount={pin?.visitCount || 0}
              visits={mockVisits}
              onPress={handleOpenVisitHistorySheet}
            />
            <TagsSection tags={pin?.tags} isLoading={isLoading} />
          </View>
        </ScrollView>
      </ThemedView>
      {pin && (
        <MustKnowsBottomSheet
          ref={bottomSheetRef}
          mustKnows={pin.mustKnows || []}
          mustKnowVotes={mustKnowVotes}
          onVote={handleVote}
        />
      )}
      {displayCoordinates && (
        <DirectionsBottomSheet
          ref={directionsBottomSheetRef}
          latitude={displayCoordinates.latitude}
          longitude={displayCoordinates.longitude}
          address={pin?.address}
          title={pin?.title || displayName}
        />
      )}
      {pin && pin.visitCount && pin.visitCount > 0 && (
        <VisitHistoryBottomSheet
          ref={visitHistoryBottomSheetRef}
          visits={mockVisits}
          visitCount={pin.visitCount}
        />
      )}
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

  //
  //
  //

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
    zIndex: 9,
  },
  overlayButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overlayRight: {
    flexDirection: 'row',
    gap: 8,
  },
});
