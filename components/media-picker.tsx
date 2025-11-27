import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import Gallery, { GalleryRef } from '@/forked/react-native-awesome-gallery';
import { MediaItem } from '@/stores/add-place-form-store';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {
  IconCamera,
  IconPhoto,
  IconPlayerPlay,
  IconX,
} from '@tabler/icons-react-native';
import { Image } from 'expo-image';
import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MediaPickerProps {
  media: MediaItem[];
  onMediaChange: (media: MediaItem[]) => void;
  maxItems?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 8;
const GRID_ITEM_SIZE = (SCREEN_WIDTH - 48 - GRID_GAP * 2) / 3; // 3 columns with padding and gaps

export default function MediaPicker({
  media = [],
  onMediaChange,
  maxItems = 5,
}: MediaPickerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const sourceSheetRef = useRef<BottomSheetModal>(null);
  const galleryRef = useRef<GalleryRef>(null);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  const openSourceSheet = () => {
    if (sourceSheetRef.current) {
      (sourceSheetRef.current as any).present();
      setTimeout(() => {
        sourceSheetRef.current?.snapToIndex(0);
      }, 100);
    }
  };

  const handleCameraPress = async () => {
    (sourceSheetRef.current as any)?.dismiss();
    setIsProcessing(true);
    try {
      const image = await ImageCropPicker.openCamera({
        cropping: true,
        freeStyleCropEnabled: true,
        avoidEmptySpaceAroundImage: true,

        cropperToolbarTitle: 'Recortar Imagen',
        cropperCancelText: 'Cancelar',
        cropperChooseText: 'Elegir',
        compressImageQuality: 0.9,
        includeBase64: false,
        mediaType: 'photo',
        cropperTintColor: Colors['light'].tint,
      });

      const newMedia: MediaItem = {
        uri: image.path,
        type: 'image',
      };
      onMediaChange([...media, newMedia]);
    } catch (error: any) {
      // User cancelled or error occurred
      if (error.message !== 'User cancelled image selection') {
        console.error('Error taking photo:', error);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLibraryPress = async () => {
    (sourceSheetRef.current as any)?.dismiss();
    setIsProcessing(true);
    try {
      const remainingSlots = maxItems - media.length;
      if (remainingSlots <= 0) return;

      // First, let user select media without cropping to get the list
      const selectedMedia = await ImageCropPicker.openPicker({
        multiple: true,
        maxFiles: remainingSlots,
        cropping: false, // Don't crop initially, we'll crop images individually
        includeBase64: false,
        mediaType: 'photo',
      });

      const mediaArray = Array.isArray(selectedMedia)
        ? selectedMedia
        : [selectedMedia];

      const newMediaItems: MediaItem[] = [];

      // Process each selected item
      for (const item of mediaArray) {
        const isVideo = (item as any).mime?.startsWith('video/');

        if (isVideo) {
          // Videos don't need cropping, add directly
          newMediaItems.push({
            uri: (item as any).path,
            type: 'video',
          });
        } else {
          // Images need to go through the cropper
          try {
            const croppedImage = await ImageCropPicker.openCropper({
              path: (item as any).path,
              mediaType: 'photo',
              freeStyleCropEnabled: true,
              avoidEmptySpaceAroundImage: false,
              cropperToolbarTitle: 'Recortar Imagen',
              cropperCancelText: 'Cancelar',
              cropperChooseText: 'Elegir',
              compressImageQuality: 0.9,
              includeBase64: false,
            });

            newMediaItems.push({
              uri: croppedImage.path,
              type: 'image',
            });
          } catch (cropError: any) {
            // If user cancels cropping, skip this image
            if (cropError.message !== 'User cancelled image selection') {
              console.error('Error cropping image:', cropError);
            }
          }
        }
      }

      if (newMediaItems.length > 0) {
        onMediaChange([...media, ...newMediaItems]);
      }
    } catch (error: any) {
      // User cancelled or error occurred
      if (error.message !== 'User cancelled image selection') {
        console.error('Error selecting media:', error);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteMedia = (index: number) => {
    const updatedMedia = media.filter((_, i) => i !== index);
    onMediaChange(updatedMedia);
  };

  const handleMediaPress = (index: number) => {
    setGalleryIndex(index);
  };

  const closeGallery = () => {
    setGalleryIndex(null);
  };

  // Filter only images for gallery (videos not supported by awesome-gallery)
  const imageMedia = media.filter((item) => item.type === 'image');
  const imageUris = imageMedia.map((item) => item.uri);

  const canAddMore = media.length < maxItems;

  return (
    <View style={styles.container}>
      {/* Media Grid */}
      {media.length > 0 && (
        <View style={styles.grid}>
          {media.map((item, index) => (
            <View key={index} style={styles.gridItem}>
              <TouchableOpacity
                onPress={() => handleMediaPress(index)}
                activeOpacity={0.8}
                style={styles.mediaContainer}
              >
                {item.type === 'image' ? (
                  <Image
                    source={{ uri: item.uri }}
                    style={styles.mediaThumbnail}
                    contentFit="cover"
                  />
                ) : (
                  <View style={styles.videoContainer}>
                    <Image
                      source={{ uri: item.uri }}
                      style={styles.mediaThumbnail}
                      contentFit="cover"
                    />
                    <View style={styles.videoOverlay}>
                      <IconPlayerPlay size={24} color="#fff" fill="#fff" />
                    </View>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteMedia(index)}
                  activeOpacity={0.7}
                >
                  <IconX size={16} color="#fff" />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          ))}
          {/* Add button in grid if space available */}
          {canAddMore && (
            <TouchableOpacity
              style={[styles.gridItem, styles.addButton]}
              onPress={openSourceSheet}
              activeOpacity={0.7}
            >
              <IconPhoto size={32} color={Colors['light'].tint} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Add Media Button (when grid is empty or has space) */}
      {canAddMore && (
        <TouchableOpacity
          style={styles.addMediaButton}
          onPress={openSourceSheet}
          activeOpacity={0.7}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color={Colors['light'].tint} />
          ) : (
            <>
              <IconPhoto
                size={24}
                color={Colors['light'].tint}
                strokeWidth={2}
              />
              <ThemedText style={styles.addMediaButtonText}>
                {media.length === 0 ? 'Agregar fotos' : 'Agregar más'}
              </ThemedText>
            </>
          )}
        </TouchableOpacity>
      )}

      {/* Source Selection Bottom Sheet */}
      <BottomSheetModal
        ref={sourceSheetRef}
        index={-1}
        snapPoints={['35%']}
        enablePanDownToClose
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
            <ThemedText type="title-serif" style={styles.bottomSheetTitle}>
              Escoge una fuente
            </ThemedText>
            <View style={styles.sourceOptions}>
              <TouchableOpacity
                style={styles.sourceOption}
                onPress={handleCameraPress}
                activeOpacity={0.7}
              >
                <View style={styles.sourceIconContainer}>
                  <IconCamera size={32} color={Colors['light'].tint} />
                </View>
                <ThemedText style={styles.sourceOptionText}>
                  Tomar foto
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sourceOption}
                onPress={handleLibraryPress}
                activeOpacity={0.7}
              >
                <View style={styles.sourceIconContainer}>
                  <IconPhoto size={32} color={Colors['light'].tint} />
                </View>
                <ThemedText style={styles.sourceOptionText}>
                  Escoger de la biblioteca
                </ThemedText>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </BottomSheetView>
      </BottomSheetModal>

      {/* Gallery Modal */}
      <Modal
        visible={galleryIndex !== null && imageUris.length > 0}
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
          {galleryIndex !== null && imageUris.length > 0 && (
            <Gallery
              ref={galleryRef}
              data={imageUris}
              initialIndex={
                galleryIndex !== null
                  ? media
                      .slice(0, galleryIndex + 1)
                      .filter((m) => m.type === 'image').length - 1
                  : 0
              }
              onIndexChange={(newIndex) => {
                // Update gallery index if needed
              }}
              onSwipeToClose={closeGallery}
              renderItem={({ item, setImageDimensions }) => (
                <Image
                  source={{ uri: item }}
                  style={styles.galleryImage}
                  contentFit="contain"
                  onLoad={(e) => {
                    // Get image dimensions for gallery
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
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    marginBottom: 16,
  },
  gridItem: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE,
    borderRadius: 8,
    overflow: 'hidden',
  },
  mediaContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  mediaThumbnail: {
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    gap: 8,
  },
  addMediaButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors['light'].text,
  },
  bottomSheetBackground: {
    backgroundColor: '#fff',
  },
  handleIndicator: {
    backgroundColor: '#E0E0E0',
  },
  bottomSheetContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bottomSheetTitle: {
    fontSize: 24,
    marginBottom: 24,
  },
  sourceOptions: {
    gap: 16,
  },
  sourceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    gap: 16,
  },
  sourceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors['light'].tint + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sourceOptionText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors['light'].text,
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
