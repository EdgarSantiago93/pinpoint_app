import { PinIcons } from '@/components/pin-icons';
import { StackedCarousel } from '@/components/stacked-slider/stacked-carousel';
import { ThemedText } from '@/components/themed-text';
import { Colors, nunito400regular } from '@/constants/theme';
import Gallery, { GalleryRef } from '@/forked/react-native-awesome-gallery';
import { PinDetail } from '@/hooks/use-pin';
import { buildStaticMapUrl } from '@/utils/utils';
import {
  IconBookmark,
  IconBookmarkFilled,
  IconMapPin,
  IconMapPinCheck,
  IconPinnedFilled,
  IconX,
} from '@tabler/icons-react-native';
import { useAudioPlayer } from 'expo-audio';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface HeroSectionProps {
  images?: PinDetail['media'];
  icon?: string;
  color?: string;
  latitude?: number;
  longitude?: number;
  isLoading: boolean;
}

export function HeroSection({
  isLoading,
  images = [],
  icon,
  color,
  latitude,
  longitude,
}: HeroSectionProps) {
  const audioSource = require('@/assets/audio/press.wav');
  const player = useAudioPlayer(audioSource);

  const { width: screenWidth } = useWindowDimensions();
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const galleryRef = useRef<GalleryRef>(null);

  const iconData = icon
    ? PinIcons.find((iconItem) => iconItem.name === icon)
    : null;
  const IconComponent = iconData?.component || PinIcons[0].component;

  const cardWidth = screenWidth - 12;
  const cardHeight = 280;

  const handleImagePress = (index: number) => {
    console.log('index', index);
    setGalleryIndex(index);
  };

  const closeGallery = () => {
    setGalleryIndex(null);
  };

  const handlePlayAudio = () => {
    player.seekTo(0.1);
    player.play();
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
            {index + 1}/{images.length}
          </ThemedText>
        </View>
      </View>
    );
  };

  const [isBookmark, setIsBookmark] = useState(false);
  const [isVisited, setIsVisited] = useState(false);

  const handlePress = () => {
    handlePlayAudio();
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          position: 'relative',
        }}
      >
        <LinearGradient
          colors={['rgba(255, 247, 240, 0.05)', Colors.light.background]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={{
            height: 90,
            width: '100%',
            position: 'absolute',
            top: 0,
            zIndex: 1000,
          }}
        />
        <LinearGradient
          colors={[
            // 'transparent',
            'rgba(255, 247, 240, 0.01)',
            // Colors.light.background + 40,
            Colors.light.background,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            height: 50,
            width: '100%',
            position: 'absolute',
            bottom: 0,
            zIndex: 1000,
          }}
        />

        <Image
          source={{
            uri: buildStaticMapUrl(latitude || 0, longitude || 0),
          }}
          style={{
            width: '100%',
            borderRadius: 12,
            overflow: 'hidden',
            height: 320,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
            width: 28,
            height: 28,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backgroundColor: 'grey',
            borderWidth: 2,
            borderColor: 'white',
          }}
        >
          <IconPinnedFilled size={12} color="white" />
        </View>
      </View>

      {images.length > 0 ? (
        <View style={styles.carouselContainer}>
          <StackedCarousel
            onImagePress={handleImagePress}
            data={images.map((image) => image.url)}
            renderCard={renderCard}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            stackOffset={10}
            showPaginator={images.length > 1}
            paginatorVisibleDots={5}
            paginatorDotSize={8}
            paginatorSpacing={8}
          />
        </View>
      ) : null}

      {isLoading ? (
        <View
          style={[styles.iconBadge, { backgroundColor: Colors.light.tint }]}
        >
          <Animated.View entering={FadeInDown.delay(300)}>
            <ActivityIndicator size="small" color="white" />
          </Animated.View>
        </View>
      ) : (
        <View
          style={[
            styles.iconBadge,
            { backgroundColor: color || Colors.light.tint },
          ]}
        >
          <Animated.View entering={FadeInDown.delay(300)}>
            <IconComponent size={32} color="white" />
          </Animated.View>
        </View>
      )}

      <Animated.View
        style={[styles.iconSectionContainer]}
        entering={FadeInDown.delay(400)}
      >
        <TouchableOpacity
          disabled={isLoading}
          style={[
            isLoading ? { opacity: 0.3 } : {},
            styles.iconSectionButton,
            {
              backgroundColor: isBookmark
                ? Colors.light.tint
                : Colors.light.background,
            },
          ]}
          onPress={handlePress}
        >
          {isBookmark ? (
            <IconBookmarkFilled size={28} color={Colors.light.background} />
          ) : (
            <IconBookmark size={28} color={Colors.light.tint} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePress}
          style={[
            isLoading ? { opacity: 0.3 } : {},
            styles.iconSectionButton,
            {
              backgroundColor: isVisited
                ? Colors.light.tint
                : Colors.light.background,
            },
          ]}
        >
          {isVisited ? (
            <IconMapPinCheck size={28} color={Colors.light.background} />
          ) : (
            <IconMapPin size={28} color={Colors.light.tint} />
          )}
        </TouchableOpacity>
      </Animated.View>

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
              data={images}
              initialIndex={galleryIndex}
              onIndexChange={(newIndex) => {
                setGalleryIndex(newIndex);
              }}
              onSwipeToClose={closeGallery}
              renderItem={({ item, setImageDimensions }) => (
                <Image
                  source={{ uri: item.url }}
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
  },
  carouselContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    overflow: 'hidden',
    height: '100%',
  },

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
  iconSectionButton: {
    width: 35,
    height: 35,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    borderWidth: 1.5,
    borderColor: Colors.light.tint,
  },
  iconSectionContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    position: 'absolute',
    bottom: -15,
    right: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
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
