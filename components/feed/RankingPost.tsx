import FeedFooter from '@/components/feed/feedFooter';
import FeedTitle from '@/components/feed/feedTitle';
import { StackedCarousel } from '@/components/stacked-slider/stacked-carousel';
import StaticMapImage from '@/components/static-map-image';
import { ThemedText } from '@/components/themed-text';
import { nunito400regular, nunito600semibold } from '@/constants/theme';
import Gallery, { GalleryRef } from '@/forked/react-native-awesome-gallery';
import { FeedPostItem } from '@/hooks/use-feed-posts';
import { IconX } from '@tabler/icons-react-native';
import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface RankingPostProps {
  post: FeedPostItem;
  onPress?: () => void;
  index?: number;
}

export function RankingPost({ post, onPress, index = 0 }: RankingPostProps) {
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const galleryRef = useRef<GalleryRef>(null);

  const cardHeight = 240;
  const minHeight = 280; // Minimum height for the container

  const handleImagePress = (index: number) => {
    setGalleryIndex(index);
  };

  const closeGallery = () => {
    setGalleryIndex(null);
  };

  const renderCard = (imageUri: string, index: number) => {
    return (
      <View style={styles.cardContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.cardImage}
          contentFit="cover"
        />
        {/* Image counter overlay */}
        {post.place &&
          post.place?.images?.length &&
          post.place?.images?.length > 1 && (
            <View style={styles.imageCounter}>
              <ThemedText style={styles.imageCounterText}>
                {index + 1}/{post.place?.images?.length}
              </ThemedText>
            </View>
          )}
      </View>
    );
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).duration(400).springify()}
      style={styles.container}
    >
      <FeedTitle post={post} onPress={onPress} />

      {/* Content */}
      <View style={styles.content}>
        <ThemedText style={styles.notes} numberOfLines={5}>
          {post.place?.description}
        </ThemedText>
        {post.place && post.place?.images && post.place?.images?.length > 0 ? (
          <View style={styles.carouselContainer}>
            <StackedCarousel
              onImagePress={handleImagePress}
              data={post.place?.images}
              renderCard={renderCard}
              cardHeight={cardHeight}
              minHeight={minHeight}
              stackOffset={8}
              showPaginator={true}
              paginatorVisibleDots={5}
              paginatorDotSize={8}
              paginatorSpacing={6}
            />
          </View>
        ) : (
          <StaticMapImage
            latitude={post.place?.latitude || 0}
            longitude={post.place?.longitude || 0}
            icon={post.place?.icon || ''}
            color={post.place?.color || ''}
            onPress={() => {}}
          />
        )}
      </View>

      {/* Gallery Modal */}
      <Modal
        visible={galleryIndex !== null}
        transparent
        animationType="fade"
        onRequestClose={closeGallery}
      >
        <View style={styles.galleryContainer}>
          <TouchableOpacity
            style={styles.galleryCloseButton}
            onPress={closeGallery}
            activeOpacity={0.7}
          >
            <IconX size={28} color="#fff" />
          </TouchableOpacity>
          {galleryIndex !== null && post.place && post.place?.images && (
            <Gallery
              ref={galleryRef}
              data={post.place?.images}
              initialIndex={galleryIndex}
              onIndexChange={(newIndex) => {
                setGalleryIndex(newIndex);
              }}
              onSwipeToClose={closeGallery}
              renderItem={({ item, setImageDimensions }) => (
                <Image
                  source={{ uri: item }}
                  style={styles.galleryImage}
                  contentFit="contain"
                  onLoad={(e) => {
                    const { width, height } = e.source;
                    if (width && height) {
                      setImageDimensions({ width, height });
                    }
                  }}
                />
              )}
            />
          )}
        </View>
      </Modal>
      <View style={{ height: 12 }} />
      <FeedFooter post={post} onPress={onPress} showVisitBadge={false} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  content: {
    paddingHorizontal: 10, // Align with avatar
  },
  notes: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
    fontFamily: nunito400regular,
  },
  notesLabel: {
    fontFamily: nunito600semibold,
  },
  carouselContainer: {
    marginTop: -10,
    marginBottom: 8,
  },
  cardContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 12,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imageCounter: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  imageCounterText: {
    color: 'white',
    fontSize: 12,
    fontFamily: nunito400regular,
  },
  galleryContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  galleryCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
});
