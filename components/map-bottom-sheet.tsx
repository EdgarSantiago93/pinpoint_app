import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { Colors, mapStyle } from '@/constants/theme';
import { reverseGeocode } from '@/forked/google-places-textinput';
import { useLocation } from '@/hooks/use-location';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {
  IconCurrentLocation,
  IconPinnedFilled,
} from '@tabler/icons-react-native';
import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {
  MapViewProps,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps';

export interface MapBottomSheetRef {
  expand: () => void;
  collapse: () => void;
  close: () => void;
  snapToIndex: (index: number) => void;
  centerToLocation: (latitude: number, longitude: number) => void;
}

export interface MapBottomSheetProps {
  region?: Region;
  initialRegion?: Region;
  onRegionChange?: (region: Region) => void;
  onRegionChangeComplete?: (
    region: Region,
    centerCoordinate: { latitude: number; longitude: number },
    address?: string,
    addressComponents?: {
      city?: string;
      country?: string;
      neighborhood?: string;
    }
  ) => void;
  geocodeLanguage?: string;
  onCancel?: () => void;
  onConfirm?: (
    region: Region,
    centerCoordinate: { latitude: number; longitude: number },
    address?: string,
    addressComponents?: {
      city?: string;
      country?: string;
      neighborhood?: string;
    }
  ) => void;

  mapViewProps?: Omit<
    MapViewProps,
    | 'region'
    | 'initialRegion'
    | 'showsUserLocation'
    | 'customMapStyle'
    | 'provider'
    | 'onRegionChange'
    | 'onRegionChangeComplete'
  >;
  onChange?: (index: number) => void;
}

export const MapBottomSheet = React.forwardRef<
  MapBottomSheetRef,
  MapBottomSheetProps
>(
  (
    {
      region,
      initialRegion,

      onRegionChange,
      onRegionChangeComplete,
      mapViewProps,
      onChange,
      geocodeLanguage = 'es',
      onCancel,
      onConfirm,
    },
    ref
  ) => {
    const useModal = true;
    const bottomSheetRef = useRef<BottomSheet>(null);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const mapRef = useRef<MapView>(null);
    const [currentAddress, setCurrentAddress] = useState<string>('');
    const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
    const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
    const [currentCenterCoordinate, setCurrentCenterCoordinate] = useState<{
      latitude: number;
      longitude: number;
    } | null>(null);
    const [currentAddressComponents, setCurrentAddressComponents] = useState<{
      city?: string;
      country?: string;
      neighborhood?: string;
    } | null>(null);

    // Helper function to extract address components
    const extractAddressComponents = useCallback(
      (
        addressComponents?: {
          long_name: string;
          short_name: string;
          types: string[];
        }[]
      ) => {
        if (!addressComponents) {
          return {
            city: undefined,
            country: undefined,
            neighborhood: undefined,
          };
        }

        let city: string | undefined;
        let country: string | undefined;
        let neighborhood: string | undefined;

        for (const component of addressComponents) {
          if (component.types.includes('locality') && !city) {
            city = component.long_name;
          }
          if (component.types.includes('country') && !country) {
            country = component.long_name;
          }
          if (component.types.includes('neighborhood') && !neighborhood) {
            neighborhood = component.long_name;
          }
        }

        return { city, country, neighborhood };
      },
      []
    );

    // Center map to a specific location
    const centerToLocation = useCallback(
      (latitude: number, longitude: number) => {
        const newRegion: Region = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        mapRef.current?.animateToRegion(newRegion, 500);
      },
      []
    );

    // Expose methods to parent component
    useImperativeHandle(
      ref,
      () => ({
        expand: () => {
          if (useModal) {
            bottomSheetModalRef.current?.present();
            // Wait for modal to be ready before expanding
            setTimeout(() => {
              bottomSheetModalRef.current?.expand();
            }, 100);
          } else {
            bottomSheetRef.current?.expand();
          }
        },
        collapse: () => {
          if (useModal) {
            bottomSheetModalRef.current?.collapse();
          } else {
            bottomSheetRef.current?.collapse();
          }
        },
        close: () => {
          if (useModal) {
            bottomSheetModalRef.current?.dismiss();
          } else {
            bottomSheetRef.current?.close();
          }
        },
        snapToIndex: (index: number) => {
          if (useModal) {
            bottomSheetModalRef.current?.snapToIndex(index);
          } else {
            bottomSheetRef.current?.snapToIndex(index);
          }
        },
        centerToLocation,
      }),
      [useModal, centerToLocation]
    );

    // Handle sheet changes
    const handleSheetChange = useCallback(
      (index: number) => {
        onChange?.(index);
      },
      [onChange]
    );

    // Render backdrop
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

    // Handle region change complete - extract center coordinate and reverse geocode
    const handleRegionChangeComplete = useCallback(
      async (region: Region, details?: any) => {
        const centerCoordinate = {
          latitude: region.latitude,
          longitude: region.longitude,
        };

        // Store current region and coordinate for confirm button
        setCurrentRegion(region);
        setCurrentCenterCoordinate(centerCoordinate);

        // Perform reverse geocoding if API key is provided
        if (process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY !== undefined) {
          setIsGeocoding(true);
          try {
            const geocodeResult = await reverseGeocode({
              latitude: centerCoordinate.latitude,
              longitude: centerCoordinate.longitude,
              apiKey: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || '',
              language: geocodeLanguage,
              resultType: ['street_address', 'route', 'premise'],
            });
            console.log(
              'geocodeResult',
              JSON.stringify(geocodeResult, null, 2)
            );

            if (!geocodeResult.error && geocodeResult.formattedAddress) {
              setCurrentAddress(geocodeResult.formattedAddress);

              // Extract address components
              const addressComponents = extractAddressComponents(
                geocodeResult.addressComponents
              );
              setCurrentAddressComponents(addressComponents);

              onRegionChangeComplete?.(
                region,
                centerCoordinate,
                geocodeResult.formattedAddress,
                addressComponents
              );
            } else {
              // Fallback to coordinates if geocoding fails
              setCurrentAddress(
                `${centerCoordinate.latitude.toFixed(6)}, ${centerCoordinate.longitude.toFixed(6)}`
              );
              setCurrentAddressComponents(null);
              onRegionChangeComplete?.(region, centerCoordinate);
            }
          } catch (error) {
            console.error('Error reverse geocoding:', error);
            setCurrentAddress(
              `${centerCoordinate.latitude.toFixed(6)}, ${centerCoordinate.longitude.toFixed(6)}`
            );
            setCurrentAddressComponents(null);
            onRegionChangeComplete?.(region, centerCoordinate);
          } finally {
            setIsGeocoding(false);
          }
        } else {
          // No API key, just use coordinates
          setCurrentAddress(
            `${centerCoordinate.latitude.toFixed(6)}, ${centerCoordinate.longitude.toFixed(6)}`
          );
          setCurrentAddressComponents(null);
          onRegionChangeComplete?.(region, centerCoordinate);
        }
      },
      [onRegionChangeComplete, geocodeLanguage, extractAddressComponents]
    );

    const handleConfirm = useCallback(() => {
      if (currentRegion && currentCenterCoordinate) {
        onConfirm?.(
          currentRegion,
          currentCenterCoordinate,
          currentAddress || undefined,
          currentAddressComponents || undefined
        );
      }
    }, [
      onConfirm,
      currentRegion,
      currentCenterCoordinate,
      currentAddress,
      currentAddressComponents,
    ]);

    const handleCancel = useCallback(() => {
      onCancel?.();
    }, [onCancel]);

    const { getCurrentLocation } = useLocation();

    const centerMapToCurrentLocation = useCallback(async () => {
      const location = await getCurrentLocation();
      if (location) {
        const newRegion = {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        mapRef.current?.animateToRegion(newRegion);
        // handleRegionChangeComplete(region);
      }
    }, [getCurrentLocation]);

    const sheetContent = (
      <BottomSheetView style={[styles.contentContainer]}>
        <View style={styles.mapContainer}>
          <View
            style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}
          >
            <TouchableOpacity onPress={centerMapToCurrentLocation}>
              <View
                style={{
                  backgroundColor: 'white',
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <IconCurrentLocation size={24} color={Colors.light.tint} />
              </View>
            </TouchableOpacity>
          </View>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            region={region}
            initialRegion={initialRegion}
            showsUserLocation={true}
            customMapStyle={mapStyle}
            onRegionChange={onRegionChange}
            onRegionChangeComplete={handleRegionChangeComplete}
            scrollEnabled={true}
            zoomEnabled={true}
            {...mapViewProps}
          />

          <View style={styles.centeredPinContainer} pointerEvents="none">
            <View style={styles.defaultPin}>
              <IconPinnedFilled size={36} color={Colors.light.tint} />
              <View style={styles.pinShadow} />
              <View style={styles.pinShadowSmall} />
            </View>
          </View>
        </View>
        <View style={styles.addressContainer}>
          {isGeocoding ? (
            <ActivityIndicator size="small" color={Colors.light.tint} />
          ) : (
            <ThemedText type="defaultSemiBold" style={styles.addressText}>
              {currentAddress || 'Mueve el mapa para seleccionar una ubicación'}
            </ThemedText>
          )}
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            title="Cancelar"
            variant="outline"
            onPress={handleCancel}
            style={styles.button}
          />
          <Button
            title="Guardar"
            variant="filled"
            onPress={handleConfirm}
            style={styles.button}
          />
        </View>
      </BottomSheetView>
    );

    const commonProps = {
      snapPoints: ['90%'],
      enablePanDownToClose: true,
      backgroundStyle: [styles.background, { backgroundColor: 'white' }],
      handleIndicatorStyle: styles.handleIndicator,
      onChange: handleSheetChange,
      backdropComponent: renderBackdrop,
    };

    return (
      <BottomSheetModal ref={bottomSheetModalRef} index={-1} {...commonProps}>
        {sheetContent}
      </BottomSheetModal>
    );
  }
);

MapBottomSheet.displayName = 'MapBottomSheet';

const styles = StyleSheet.create({
  background: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleIndicator: {
    backgroundColor: '#D1D5DB',
    width: 40,
    height: 4,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 0,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    height: Dimensions.get('window').height * 0.6,
    margin: 10,
  },
  map: {
    height: '100%',
    borderRadius: 10,
    // padding: 10,
  },
  centeredPinContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -25, // Half of pin height
    marginLeft: -12, // Half of pin width
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  defaultPin: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  pinShadow: {
    width: 18,
    height: 18,
    borderRadius: 10,
    backgroundColor: '#000000',
    opacity: 0.2,
    marginTop: -1,
  },
  pinShadowSmall: {
    width: 6,
    height: 6,
    borderRadius: 10,
    backgroundColor: '#000000',
    opacity: 0.3,
    marginTop: -12,
  },
  addressContainer: {
    padding: 16,
    paddingTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  addressText: {
    fontSize: 14,
    color: Colors.light.text,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
    width: '100%',
  },
  button: {
    flex: 1,
  },
});
