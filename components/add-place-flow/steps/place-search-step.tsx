import { Button } from '@/components/button';
import {
  MapBottomSheet,
  MapBottomSheetRef,
} from '@/components/map-bottom-sheet';
import { normalizeNearbyPlace, PlaceList } from '@/components/place-list';
import { PlaceSearch } from '@/components/place-search';
import { ThemedText } from '@/components/themed-text';
import { Colors, nunito400regular } from '@/constants/theme';
import { useNearbyPlaces } from '@/forked/google-places-textinput';
import { useLocation, UserLocation } from '@/hooks/use-location';
import { AddPlaceFormData } from '@/stores/add-place-form-store';
import { IconMapPin } from '@tabler/icons-react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, View } from 'react-native';
import { Region } from 'react-native-maps';

const PlaceSearchStepComponent = ({
  formData,
  onDataChange,
  onNext,
}: {
  formData: AddPlaceFormData;
  onDataChange: (data: Partial<AddPlaceFormData>) => void;
  onNext?: () => void;
}) => {
  const { loading, places, fetchPlaces } = useNearbyPlaces();
  const { getCurrentLocation, loading: locationLoading } = useLocation();
  const mapSheetRef = useRef<MapBottomSheetRef>(null);
  const [currentLocation, setCurrentLocation] = useState<UserLocation | null>(
    null
  );

  const handleNearbySearch = useCallback(async () => {
    const location = await getCurrentLocation();
    if (location) {
      setCurrentLocation(location);
      await fetchPlaces({
        latitude: location.latitude,
        longitude: location.longitude,
        radius: 2000,
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || '',
        includedTypes: ['restaurant', 'cafe', 'bar', 'hotel', 'coffee_shop'],
      });

      // handleRegionChangeComplete(region);
    }
  }, [getCurrentLocation, fetchPlaces]);

  useEffect(() => {
    handleNearbySearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Normalize nearby places for the PlaceList component
  const normalizedPlaces = useMemo(() => {
    return places
      .map((place) => normalizeNearbyPlace(place, currentLocation))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [places, currentLocation]);

  const handleNearbyPlaceSelect = useCallback(
    (place: ReturnType<typeof normalizeNearbyPlace>) => {
      console.log('🏈 NEARBYplace', JSON.stringify(place, null, 2));
      onDataChange({
        placeData: {
          name: place.name,
          address: place.address || place.formattedAddress || '',
          latitude: place.location?.latitude || 0,
          longitude: place.location?.longitude || 0,
          placeId: place.placeId,
          types: place.types || [],
          city: place.city || '',
          country: place.country || '',
          neighborhood: place.neighborhood || '',
        },
      });
      onNext?.();
    },
    [onDataChange, onNext]
  );
  const handleMapConfirm = useCallback(
    (
      region: Region,
      centerCoordinate: { latitude: number; longitude: number },
      address?: string,
      addressComponents?: {
        city?: string;
        country?: string;
        neighborhood?: string;
      }
    ) => {
      console.log(
        'handleMapConfirm',
        JSON.stringify(
          {
            region,
            centerCoordinate,
            address,
            addressComponents,
          },
          null,
          2
        )
      );

      console.log(
        'O+FINAL SER',
        JSON.stringify(
          {
            name: address || 'Selected Location',
            address:
              address ||
              `${centerCoordinate.latitude.toFixed(6)}, ${centerCoordinate.longitude.toFixed(6)}`,
            latitude: centerCoordinate.latitude,
            longitude: centerCoordinate.longitude,
            placeId: '',
            types: [],
            city: addressComponents?.city || '',
            country: addressComponents?.country || '',
            neighborhood: addressComponents?.neighborhood || '',
          },
          null,
          2
        )
      );
      onDataChange({
        placeData: {
          name: address ?? '',
          address:
            address ||
            `${centerCoordinate.latitude.toFixed(6)}, ${centerCoordinate.longitude.toFixed(6)}`,
          latitude: centerCoordinate.latitude,
          longitude: centerCoordinate.longitude,
          placeId: '',
          types: [],
          city: addressComponents?.city || '',
          country: addressComponents?.country || '',
          neighborhood: addressComponents?.neighborhood || '',
        },
      });
      mapSheetRef.current?.close();
      onNext?.();
    },
    [onDataChange, onNext]
  );

  const [showPlaceSearch, setShowPlaceSearch] = useState(false);

  return (
    // <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.stepContent}>
      <ThemedText type="title-serif" style={styles.stepTitle}>
        Donde está este lugar?
      </ThemedText>
      <ThemedText style={styles.stepDescription}>
        Busca el lugar que quieres agregar
      </ThemedText>
      <Button
        variant="text"
        title="Escoger ubicación en el mapa"
        icon={<IconMapPin size={20} color={Colors['light'].tint} />}
        onPress={async () => {
          mapSheetRef.current?.expand();
          const location = await getCurrentLocation();
          if (location) {
            setTimeout(() => {
              mapSheetRef.current?.centerToLocation(
                location.latitude,
                location.longitude
              );
            }, 300);
          }
        }}
      />

      <PlaceSearchInput
        showPlaceSearch={showPlaceSearch}
        setShowPlaceSearch={setShowPlaceSearch}
        onPlaceSelect={(place) => {
          // Transform NormalizedPlaceItem to placeData structure
          onDataChange({
            placeData: {
              name: place.name,
              address: place.address || place.formattedAddress || '',
              latitude: place.location?.latitude || 0,
              longitude: place.location?.longitude || 0,
              placeId: place.placeId,
              types: place.types || [],
              city: place.city || '',
              country: place.country || '',
              neighborhood: place.neighborhood || '',
            },
          });
          onNext?.();
        }}
      />

      {!showPlaceSearch ? (
        loading || locationLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors['light'].tint} />
          </View>
        ) : (
          <View style={{ flex: 1, marginTop: 16 }}>
            <ThemedText
              type="subtitle"
              style={{ marginBottom: 0, fontSize: 18, color: '#687076' }}
            >
              Lugares cercanos a ti
            </ThemedText>

            <PlaceList
              places={normalizedPlaces}
              onPlaceSelect={handleNearbyPlaceSelect}
              containerStyle={styles.nearbyPlacesContainer}
              backgroundColor="#FFF"
              accessibilityLabel="Nearby places"
            />
          </View>
        )
      ) : null}

      <MapBottomSheet
        ref={mapSheetRef}
        initialRegion={
          formData.placeData
            ? {
                latitude: formData.placeData.latitude,
                longitude: formData.placeData.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            : undefined
        }
        geocodeLanguage="es"
        onCancel={mapSheetRef.current?.close}
        onConfirm={handleMapConfirm}
        onRegionChangeComplete={(
          region,
          centerCoordinate,
          address,
          addressComponents
        ) => {
          // Update form data when user selects a location on the map
          // Use the reverse geocoded address if available, otherwise use coordinates
          console.log(
            '🟠🟠🟠Address components:',
            JSON.stringify(addressComponents, null, 2)
          );
          console.log('🟠🟠🟠Address:', address);
          console.log('🟠🟠🟠Center coordinate:', centerCoordinate);
          console.log('🟠🟠🟠Latitude:', centerCoordinate.latitude);
          console.log('🟠🟠🟠Longitude:', centerCoordinate.longitude);
          console.log('🟠🟠🟠Latitude delta:', region);
          onDataChange({
            placeData: {
              name: address || 'Selected Location',
              address:
                address ||
                `${centerCoordinate.latitude.toFixed(6)}, ${centerCoordinate.longitude.toFixed(6)}`,
              latitude: centerCoordinate.latitude,
              longitude: centerCoordinate.longitude,
              placeId: '',
              types: [],
              city: addressComponents?.city || '',
              country: addressComponents?.country || '',
              neighborhood: addressComponents?.neighborhood || '',
            },
          });
        }}
      />
    </View>
    // </SafeAreaView>
  );
};

export default PlaceSearchStepComponent;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 15.5,
    paddingVertical: 12,
    gap: 12,
    height: 56,
    fontSize: 16,
    fontFamily: nunito400regular,
    padding: 0,
    margin: 0,
    borderWidth: 1.5,
    color: Colors.light.text,
    borderColor: '#91212199',
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
    color: Colors.light.text,
    // backgroundColor: 'red',
    backgroundColor: 'transparent',
  },

  stepContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    // backgroundColor: 'red',
    alignSelf: 'stretch',
    height: '100%',
  },

  stepTitle: {
    fontSize: 28,
    marginBottom: 8,
  },

  stepDescription: {
    fontSize: 16,
    color: '#687076',
    marginBottom: 18,
  },

  loadingContainer: {
    marginTop: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },

  nearbyPlacesContainer: {
    marginTop: 6,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // maxHeight: 400,
  },
});

const PlaceSearchInput = ({
  onPlaceSelect,
  showPlaceSearch,
  setShowPlaceSearch,
}: {
  onPlaceSelect: (place: any) => void;
  showPlaceSearch: boolean;
  setShowPlaceSearch: (show: boolean) => void;
}) => {
  if (showPlaceSearch) {
    return <PlaceSearch onPlaceSelect={onPlaceSelect} />;
  }
  return (
    <TextInput
      onPress={() => setShowPlaceSearch(true)}
      style={styles.inputContainer}
      placeholder="Buscar un lugar..."
      placeholderTextColor={Colors['light'].icon}
      editable={false}
      // value={formData.placeData?.name}
    />
  );
};
