import { ThemedText } from '@/components/themed-text';
import { nunito600semibold } from '@/constants/theme';
import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface AvatarProps {
  /**
   * Image URI to display. If not provided or fails to load, initials will be shown.
   */
  imageUri?: string | null;
  /**
   * User's name to generate initials from
   */
  name?: string | null;
  /**
   * Size of the avatar in pixels
   * @default 40
   */
  size?: number;
  /**
   * Background color for the avatar when showing initials
   * @default '#E0E0E0'
   */
  backgroundColor?: string;
  /**
   * Text color for initials
   * @default '#687076'
   */
  textColor?: string;
  /**
   * Custom style for the container
   */
  style?: ViewStyle;
}

/**
 * Generates initials from a name
 * Takes first letter of each word, up to 2 letters, uppercase
 */
function getInitials(name?: string | null): string {
  if (!name) return '?';
  
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  
  return initials || '?';
}

export function Avatar({
  imageUri,
  name,
  size = 40,
  backgroundColor = '#E0E0E0',
  textColor = '#687076',
  style,
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  const showImage = imageUri && !imageError;
  const initials = getInitials(name);
  
  // Calculate font size based on avatar size
  const fontSize = size * 0.4; // 40% of avatar size
  
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: showImage ? 'transparent' : backgroundColor,
        },
        style,
      ]}
    >
      {showImage ? (
        <Image
          source={{ uri: imageUri }}
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
          contentFit="cover"
          onLoadStart={() => setImageLoading(true)}
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageError(true);
            setImageLoading(false);
          }}
        />
      ) : null}
      
      {/* Show initials if no image or image failed to load */}
      {(!showImage || imageLoading) && (
        <View
          style={[
            styles.initialsContainer,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor,
            },
          ]}
        >
          <ThemedText
            style={[
              styles.initialsText,
              {
                fontSize,
                color: textColor,
              },
            ]}
          >
            {initials}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initialsContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontFamily: nunito600semibold,
    fontWeight: '600',
  },
});

