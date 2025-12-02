import { SkeletonBox } from '@/components/pageComponents/profile/skeleton';
import { AvatarGroup } from '@/components/place-detail/avatar-group';
import { EngagementSection } from '@/components/place-detail/engagement-section';
import { RatingSection } from '@/components/place-detail/rating-section';
import { ThemedText } from '@/components/themed-text';
import { FlexView } from '@/components/ui/flex-view';
import { PinDetail } from '@/hooks/use-pin';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

interface PlaceHeaderProps {
  pin?: PinDetail;
  name: string;
  isLoading: boolean;
}

export function PlaceHeader({ name, pin, isLoading }: PlaceHeaderProps) {
  const formatAddress = () => {
    return pin?.address || 'No hay dirección disponible';
  };

  return (
    <>
      <View style={styles.nameSection}>
        <View style={styles.nameContainer}>
          <FlexView
            animated
            entering={FadeInUp.duration(120).delay(200).springify()}
          >
            <ThemedText type="title-serif" style={styles.title}>
              {name}
            </ThemedText>
          </FlexView>

          <View style={{ marginBottom: 4, marginTop: 4 }}>
            {isLoading ? (
              <SkeletonBox height={24} width={200} />
            ) : (
              <Animated.View
                entering={FadeIn.duration(120).delay(200).springify()}
              >
                <EngagementSection createdBy={pin?.createdBy} />
              </Animated.View>
            )}
          </View>

          <View style={{ marginBottom: 4, marginTop: 4 }}>
            <RatingSection
              rating={pin?.rating || 0}
              reviewCount={2183}
              isLoading={isLoading}
            />
          </View>

          <View style={{ marginBottom: 4, marginTop: 4 }}>
            <AvatarGroup
              visitors={[
                {
                  id: '1',
                  name: 'John Doe',
                  avatar: 'https://placedog.net/300',
                },
                {
                  id: '2',
                  name: 'Jane Doe',
                  avatar: 'https://via.placeholder.com/150',
                },
                {
                  id: '3',
                  name: 'Jim Doe',
                  avatar: 'https://via.placeholder.com/150',
                },
              ]}
              totalVisitors={103}
              isLoading={isLoading}
            />
          </View>

          {isLoading ? (
            <View style={{ gap: 5 }}>
              <SkeletonBox height={24} width={'100%'} />
              <SkeletonBox height={24} width={'100%'} />
            </View>
          ) : (
            <Animated.View
              entering={FadeIn.duration(120).delay(200).springify()}
            >
              <ThemedText type="dimmed" style={styles.address}>
                {formatAddress()}
              </ThemedText>
            </Animated.View>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  nameSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
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
    fontSize: 32,
    // marginBottom: 4,
  },
  address: {
    fontSize: 14,
    marginTop: 8,
  },
});
