import {
  nunito400regular,
  nunito600semibold,
  nunito700bold,
} from '@/constants/theme';
import type { PlacePrediction } from '@/forked/google-places-textinput';
import { UserLocation } from '@/hooks/use-location';
import { haversineDistance } from '@/utils/utils';
import React from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

/**
 * Normalized place item interface that works with both:
 * - Place predictions from GooglePlacesTextInput
 * - Nearby places from useNearbyPlaces
 */
export interface NormalizedPlaceItem {
  placeId: string;
  name: string;
  address: string;
  types?: string[];
  // Additional data that might be available
  location?: {
    latitude: number;
    longitude: number;
  };
  formattedAddress?: string;
  distance?: number;
  city?: string;
  country?: string;
  neighborhood?: string;
}

interface PlaceListProps {
  /**
   * Array of normalized place items to display
   */
  places: NormalizedPlaceItem[];
  /**
   * Callback when a place is selected
   */
  onPlaceSelect: (place: NormalizedPlaceItem) => void;
  /**
   * Whether the list is scrollable
   * @default true
   */
  scrollEnabled?: boolean;
  /**
   * Whether nested scrolling is enabled
   * @default true
   */
  nestedScrollEnabled?: boolean;
  /**
   * Maximum number of lines for main text
   */
  mainTextNumberOfLines?: number;
  /**
   * Maximum number of lines for secondary text
   */
  secondaryTextNumberOfLines?: number;
  /**
   * How to ellipsize text
   * @default 'tail'
   */
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  /**
   * Custom container style
   */
  containerStyle?: ViewStyle;
  /**
   * Custom item style
   */
  itemStyle?: ViewStyle;
  /**
   * Custom main text style
   */
  mainTextStyle?: ViewStyle;
  /**
   * Custom secondary text style
   */
  secondaryTextStyle?: ViewStyle;
  /**
   * Background color for the list container
   */
  backgroundColor?: string;
  /**
   * Accessibility label for the list
   */
  accessibilityLabel?: string;
  /**
   * Function to generate accessibility label for each item
   */
  getItemAccessibilityLabel?: (place: NormalizedPlaceItem) => string;
  /**
   * Empty state component to show when list is empty
   */
  emptyComponent?: React.ReactNode;
}

/**
 * Reusable component for displaying a list of places.
 * Works with both Google Places predictions and nearby places.
 */
export function PlaceList({
  places,
  onPlaceSelect,
  scrollEnabled = true,
  nestedScrollEnabled = true,
  mainTextNumberOfLines,
  secondaryTextNumberOfLines,
  ellipsizeMode = 'tail',
  containerStyle,
  itemStyle,
  secondaryTextStyle,
  backgroundColor = '#efeff1',
  accessibilityLabel,
  getItemAccessibilityLabel,
  emptyComponent,
}: PlaceListProps) {
  const renderItem = ({
    item,
    index,
  }: {
    item: NormalizedPlaceItem;
    index: number;
  }) => {
    const defaultAccessibilityLabel = `${item.name}${
      item.address ? `, ${item.address}` : ''
    }`;
    const accessibilityLabel =
      getItemAccessibilityLabel?.(item) || defaultAccessibilityLabel;

    return (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint="Double tap to select this place"
        style={[
          styles.item,
          index > 0 ? styles.separatorLine : {},
          { backgroundColor },
          itemStyle,
        ]}
        onPress={() => onPlaceSelect(item)}
        // Fix for web: onBlur fires before onPress, hiding suggestions too early.
        {...(Platform.OS === 'web' &&
          ({
            onMouseDown: () => {
              // Prevent blur from hiding the list
            },
          } as any))}
      >
        <Text
          style={[styles.mainText]}
          numberOfLines={mainTextNumberOfLines}
          ellipsizeMode={ellipsizeMode}
        >
          {item.name}
        </Text>
        {item.address && (
          <Text
            style={[styles.secondaryText]}
            numberOfLines={secondaryTextNumberOfLines}
            ellipsizeMode={ellipsizeMode}
          >
            {item.address.slice(0, 50)}...
          </Text>
        )}
        {item.distance && (
          <Text
            style={[styles.distanceText]}
            numberOfLines={secondaryTextNumberOfLines}
            ellipsizeMode={ellipsizeMode}
          >
            {Math.round(item.distance * 1000)} m
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  if (places.length === 0 && emptyComponent) {
    return (
      <View style={[styles.container, containerStyle]}>{emptyComponent}</View>
    );
  }

  if (places.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor }, containerStyle]}>
      <FlatList
        data={places}
        renderItem={renderItem}
        keyExtractor={(item) => item.placeId}
        keyboardShouldPersistTaps="always"
        scrollEnabled={scrollEnabled}
        nestedScrollEnabled={nestedScrollEnabled}
        bounces={false}
        accessibilityRole="list"
        accessibilityLabel={
          accessibilityLabel || `${places.length} place suggestions`
        }
        ListEmptyComponent={
          emptyComponent ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {emptyComponent}
            </View>
          ) : undefined
        }
      />
    </View>
  );
}

/**
 * Normalizes a PlacePrediction from GooglePlacesTextInput to NormalizedPlaceItem
 */
export function normalizePlacePrediction(
  prediction: PlacePrediction
): NormalizedPlaceItem {
  return {
    placeId: prediction.placeId,
    name: prediction.structuredFormat.mainText.text,
    address: prediction.structuredFormat.secondaryText?.text || '',
    types: prediction.types,
  };
}

/**
 * Helper function to extract address components (city, country, neighborhood)
 * from addressComponents array
 */
export function extractAddressComponents(
  addressComponents?: {
    longText?: string;
    shortText?: string;
    types?: string[];
    languageCode?: string;
  }[]
) {
  if (!addressComponents) {
    return { city: undefined, country: undefined, neighborhood: undefined };
  }

  let city: string | undefined;
  let country: string | undefined;
  let neighborhood: string | undefined;

  for (const component of addressComponents) {
    if (!component.types || !component.longText) continue;

    if (component.types.includes('locality') && !city) {
      city = component.longText;
    }
    if (component.types.includes('country') && !country) {
      country = component.longText;
    }
    if (component.types.includes('neighborhood') && !neighborhood) {
      neighborhood = component.longText;
    }
  }

  return { city, country, neighborhood };
}

/**
 * Normalizes a nearby place from useNearbyPlaces to NormalizedPlaceItem
 */
export function normalizeNearbyPlace(
  place: any,
  currentLocation: UserLocation | null
): NormalizedPlaceItem {
  const addressComponents = extractAddressComponents(place.addressComponents);

  return {
    placeId: place.id || place.placeId,
    name: place.displayName?.text || place.name || '',
    address: place.formattedAddress || place.address || '',
    types: place.types || [],
    location: place.location
      ? {
          latitude: place.location.latitude,
          longitude: place.location.longitude,
        }
      : undefined,
    formattedAddress: place.formattedAddress,
    distance: currentLocation
      ? haversineDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          place.location.latitude,
          place.location.longitude
        )
      : 0,
    city: addressComponents.city,
    country: addressComponents.country,
    neighborhood: addressComponents.neighborhood,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efeff1',
    borderRadius: 6,
    // marginTop: 3,
    overflow: 'hidden',
  },
  item: {
    padding: 10,
  },
  separatorLine: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#c8c7cc',
  },
  mainText: {
    fontSize: 16,
    textAlign: 'left',
    color: '#000000',
    fontFamily: nunito600semibold,
  },
  secondaryText: {
    fontSize: 14,
    color: '#666',
    marginTop: 0,
    textAlign: 'left',
    fontFamily: nunito400regular,
  },
  distanceText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    textAlign: 'left',
    fontFamily: nunito700bold,
    fontWeight: 'bold',
  },
});
