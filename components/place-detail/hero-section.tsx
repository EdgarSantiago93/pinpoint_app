import { PinIcons } from '@/components/pin-icons';
import { StackedCarousel } from '@/components/stacked-slider/stacked-carousel';
import { ThemedText } from '@/components/themed-text';
import { Colors, nunito400regular } from '@/constants/theme';
import Gallery, { GalleryRef } from '@/forked/react-native-awesome-gallery';
import { IconArrowLeft, IconMap2, IconX } from '@tabler/icons-react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeroSectionProps {
  images?: string[];
  icon?: string;
  color?: string;
}

export function HeroSection({ images = [], icon, color }: HeroSectionProps) {
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const galleryRef = useRef<GalleryRef>(null);

  const iconData = icon
    ? PinIcons.find((iconItem) => iconItem.name === icon)
    : null;
  const IconComponent = iconData?.component || PinIcons[0].component;

  // Default images if none provided
  const defaultImages = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
  ];

  const imageData = images.length > 0 ? images : defaultImages;
  const cardWidth = screenWidth - 12;
  const cardHeight = 280;

  const handleImagePress = (index: number) => {
    console.log('index', index);
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
        <View style={styles.imageCounter}>
          <ThemedText style={styles.imageCounterText}>
            {index + 1}/{imageData.length}
          </ThemedText>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
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
        <View style={styles.overlayRight}>
          <TouchableOpacity style={styles.overlayButton}>
            <IconMap2 size={22} color={Colors.light.tint} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stacked Carousel */}
      <View style={styles.carouselContainer}>
        <StackedCarousel
          onImagePress={handleImagePress}
          data={imageData}
          renderCard={renderCard}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          stackOffset={10}
          showPaginator={imageData.length > 1}
          paginatorVisibleDots={5}
          paginatorDotSize={8}
          paginatorSpacing={8}
        />
      </View>

      {/* Icon Badge */}
      <View
        style={[
          styles.iconBadge,
          { backgroundColor: color || Colors.light.tint },
        ]}
      >
        <IconComponent size={32} color="white" />
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
          {galleryIndex !== null && (
            <Gallery
              ref={galleryRef}
              data={imageData}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    // height: '100%',
    // height: 350,
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
    zIndex: 1000,
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
  carouselContainer: {
    // display: 'flex',
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    // minHeight: 400,
    overflow: 'hidden',
    // backgroundColor: 'red',
    height: '100%',
  },
  // carousel: {
  //   backgroundColor: 'transparent',
  //   paddingVertical: 0,
  // },
  cardContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imageCounter: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  imageCounterText: {
    color: 'white',
    fontSize: 12,
    fontFamily: nunito400regular,
  },
  iconBadge: {
    position: 'absolute',
    bottom: -15,
    left: '50%',
    transform: [{ translateX: -30 }],
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
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
