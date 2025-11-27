import {
  extractAddressComponents,
  NormalizedPlaceItem,
} from '@/components/place-list';
import { Colors, nunito400regular, nunito600semibold } from '@/constants/theme';
import GooglePlacesTextInput from '@/forked/google-places-textinput';
import { useLocation, UserLocation } from '@/hooks/use-location';
import { haversineDistance } from '@/utils/utils';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import type { Place } from 'react-native-google-places-textinput';

interface PlaceSearchProps {
  onPlaceSelect: (place: any) => void;
  placeholder?: string;
  value?: string;
  apiKey?: string;
}

export function PlaceSearch({
  onPlaceSelect,
  placeholder = 'Buscar un lugar...',
  value,
  apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || '',
}: PlaceSearchProps) {
  const colors = Colors['light'];

  const handlePlaceSelect = (place: Place) => {
    const details = place.details;
    console.log('🟠🟠🟠original', JSON.stringify(place, null, 2));

    if (details) {
      // Extract address components from details.addressComponents
      const addressComponents = extractAddressComponents(
        details.addressComponents as any
      );

      const location = details.location
        ? {
            latitude: details.location.latitude,
            longitude: details.location.longitude,
          }
        : undefined;

      // Use structuredFormat.mainText.text for name (details.name can be a place ID)
      const name = place.structuredFormat.mainText.text || '';

      // Use place.types for types (not details.types)
      const types = place.types || [];

      // Use details.formatted_address for formattedAddress and address
      const formattedAddress = details.formatted_address || '';
      const address =
        formattedAddress || place.structuredFormat.secondaryText?.text || '';

      const normalizedPlace: NormalizedPlaceItem = {
        placeId: place.placeId,
        name,
        address,
        types,
        location,
        formattedAddress,
        distance:
          currentLocation && location
            ? haversineDistance(
                currentLocation.latitude,
                currentLocation.longitude,
                location.latitude,
                location.longitude
              )
            : undefined,
        city: addressComponents.city,
        country: addressComponents.country,
        neighborhood: addressComponents.neighborhood,
      };

      console.log('normalizedPlace', JSON.stringify(normalizedPlace, null, 2));
      onPlaceSelect(normalizedPlace);
    } else {
      // Fallback if details are not fetched
      const normalizedPlace: NormalizedPlaceItem = {
        placeId: place.placeId,
        name: place.structuredFormat.mainText.text,
        address: place.structuredFormat.secondaryText?.text || '',
        types: place.types || [],
        location: undefined,
        formattedAddress: place.structuredFormat.secondaryText?.text || '',
        distance: undefined,
        city: undefined,
        country: undefined,
        neighborhood: undefined,
      };

      onPlaceSelect(normalizedPlace);
    }
  };

  const { getCurrentLocation } = useLocation();
  const [currentLocation, setCurrentLocation] = useState<UserLocation | null>(
    null
  );
  const [locationBias, setLocationBias] = useState<LocationBias | null>(null);
  interface LocationBias {
    circle: {
      center: {
        latitude: number;
        longitude: number;
      };
      radius: number;
    };
  }

  useEffect(() => {
    const fetchLocation = async () => {
      const location = await getCurrentLocation();
      if (location) {
        console.log('location', location);
        setCurrentLocation(location);
        setLocationBias({
          circle: {
            center: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
            radius: 5000.0, // meters
          },
        });
      }
    };

    fetchLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  return (
    <GooglePlacesTextInput
      apiKey={apiKey}
      onPlaceSelect={handlePlaceSelect}
      autoFocus={true}
      languageCode="es"
      nestedScrollEnabled={false}
      scrollEnabled={true}
      placeHolderText={placeholder}
      value={value}
      fetchDetails={true}
      types={['restaurant', 'cafe', 'bar', 'bakery', 'coffee_shop']}
      detailsFields={['name', 'attributions', 'location', 'addressComponents']}
      locationBias={locationBias || undefined}
      autoCorrect={false}
      hideOnKeyboardDismiss={false}
      style={{
        container: styles.googlePlacesContainer,
        input: styles.textInput,
        suggestionsContainer: styles.suggestionsContainer,
        suggestionsList: styles.listView,
        suggestionItem: styles.row,
        suggestionText: {
          main: styles.mainText,
          secondary: styles.secondaryText,
        },
        placeholder: {
          color: colors.icon,
        },
      }}
    />
    // </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'red',
  },

  googlePlacesContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    // backgroundColor: 'yellow',
  },
  textInput: {
    fontSize: 16,
    fontFamily: nunito400regular,
    padding: 0,
    margin: 0,
    borderWidth: 1.5,
    color: Colors.light.text,
    backgroundColor: 'transparent',
    borderColor: '#91212199',
    borderRadius: 8,
  },
  suggestionsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginTop: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // maxHeight: 800,
  },
  listView: {
    backgroundColor: 'transparent',
  },
  row: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  mainText: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: nunito600semibold,
  },
  secondaryText: {
    fontSize: 12,
    color: '#666',
    fontFamily: nunito400regular,
    marginTop: 2,
  },
});
