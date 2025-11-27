import { AnimatedPinMarker } from '@/components/animated-marker';
import { Button } from '@/components/button';
import { styles } from '@/components/pageComponents/map/styles';
import { mapStyle } from '@/constants/theme';
import { useLocation } from '@/hooks/use-location';
import { NearbyPin, useNearbyPins } from '@/hooks/use-nearby-pins';
import { IconCurrentLocation } from '@tabler/icons-react-native';
import { getPermissionsAsync, requestPermissionsAsync } from 'expo-maps';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function Map() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 20) + 80;

  const initialRegion = useState<MapRegion>({
    latitude: 23.124914,
    longitude: -99.398968,
    latitudeDelta: 12, // ~zoom level 5, shows whole country
    longitudeDelta: 12,
  })[0];

  const [allPins, setAllPins] = useState<NearbyPin[]>([]);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);
  const [currentRegion, setCurrentRegion] = useState<MapRegion | null>(null);

  // Throttled map center for API calls (updates max every 500ms)
  const throttledMapCenterRef = useRef<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const throttleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastFetchTimeRef = useRef<number>(0);
  const [throttledMapCenter, setThrottledMapCenter] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const THROTTLE_DELAY = 1000; // Fetch every 500ms while scrolling

  // Throttled setter for map center
  const setThrottledMapCenterValue = useCallback(
    (newValue: { latitude: number; longitude: number }) => {
      const now = Date.now();
      const timeSinceLastFetch = now - lastFetchTimeRef.current;

      if (timeSinceLastFetch >= THROTTLE_DELAY) {
        // Enough time has passed, update immediately
        setThrottledMapCenter(newValue);
        lastFetchTimeRef.current = now;

        // Clear any pending timeout
        if (throttleTimeoutRef.current) {
          clearTimeout(throttleTimeoutRef.current);
          throttleTimeoutRef.current = null;
        }
      } else {
        // Not enough time has passed, schedule an update
        throttledMapCenterRef.current = newValue;

        // Clear existing timeout
        if (throttleTimeoutRef.current) {
          clearTimeout(throttleTimeoutRef.current);
        }

        // Schedule update after remaining time
        const remainingTime = THROTTLE_DELAY - timeSinceLastFetch;
        throttleTimeoutRef.current = setTimeout(() => {
          if (throttledMapCenterRef.current) {
            setThrottledMapCenter(throttledMapCenterRef.current);
            lastFetchTimeRef.current = Date.now();
            throttledMapCenterRef.current = null;
          }
          throttleTimeoutRef.current = null;
        }, remainingTime);
      }
    },
    []
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
      }
    };
  }, []);

  // Check and request map permissions
  const checkPermissions = useCallback(async () => {
    try {
      const { status } = await getPermissionsAsync();
      if (status === 'granted') {
        setHasLocationPermission(true);
        setIsCheckingPermission(false);
      } else {
        setHasLocationPermission(false);
        setIsCheckingPermission(false);
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
      setIsCheckingPermission(false);
    }
  }, []);

  const requestPermissions = useCallback(async () => {
    try {
      setIsCheckingPermission(true);
      const { status } = await requestPermissionsAsync();
      if (status === 'granted') {
        setHasLocationPermission(true);
      } else {
        setHasLocationPermission(false);
        Alert.alert(
          'Permiso de ubicación requerido',
          'Por favor, habilita los permisos de ubicación en tus ajustes de dispositivo para usar las características del mapa.',
          [{ text: 'OK' }]
        );
      }
      setIsCheckingPermission(false);
    } catch (error) {
      console.error('Error requesting permissions:', error);
      setIsCheckingPermission(false);
    }
  }, []);

  // Check permissions on mount
  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);
  const mapRef = useRef<MapView>(null);

  // Fetch pins (replace with your API call)
  useFocusEffect(
    useCallback(() => {
      // TODO: Fetch pins from your API
      // For now, using mock data
      // fetchPins().then(setAllPins);
    }, [])
  );

  const { getCurrentLocation } = useLocation();

  // Fetch nearby pins when throttled map center changes
  const { data: nearbyPins, isLoading: isLoadingPins } = useNearbyPins({
    latitude: throttledMapCenter?.latitude ?? 0,
    longitude: throttledMapCenter?.longitude ?? 0,
    radius: 5000, // 5km
    limit: 50,
    enabled: !!throttledMapCenter,
  });

  // Update pins when nearby pins are fetched
  useEffect(() => {
    if (nearbyPins) {
      setAllPins(nearbyPins);
    }
  }, [nearbyPins]);

  // Filter pins to only show those in viewport with zoom-based limits
  const visiblePins = useMemo(() => {
    if (!currentRegion || allPins.length === 0) return [];

    // Calculate viewport bounds
    const latDelta = currentRegion.latitudeDelta;
    const lonDelta = currentRegion.longitudeDelta;
    const minLat = currentRegion.latitude - latDelta / 2;
    const maxLat = currentRegion.latitude + latDelta / 2;
    const minLon = currentRegion.longitude - lonDelta / 2;
    const maxLon = currentRegion.longitude + lonDelta / 2;

    // Filter pins in viewport
    const inViewport = allPins.filter(
      (pin) =>
        pin.latitude >= minLat &&
        pin.latitude <= maxLat &&
        pin.longitude >= minLon &&
        pin.longitude <= maxLon
    );

    // Limit based on zoom level (fewer pins at lower zoom, more when zoomed in)
    // Higher latitudeDelta = more zoomed out = fewer pins
    let maxPins: number;
    if (latDelta > 0.1) {
      // Country/continent view - show fewer pins
      maxPins = 20;
    } else if (latDelta > 0.05) {
      // City/region view - show moderate amount
      maxPins = 50;
    } else if (latDelta > 0.01) {
      // Neighborhood view - show more pins
      maxPins = 100;
    } else {
      // Street level - show all pins
      maxPins = 200;
    }

    return inViewport.slice(0, maxPins);
  }, [allPins, currentRegion]);

  const centerMapToCurrentLocation = useCallback(async () => {
    console.log('centerMapToCurrentLocation');
    const location = await getCurrentLocation();
    console.log('newwwwlocation', location);
    if (location) {
      const newRegion = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setThrottledMapCenterValue({
        latitude: location.latitude,
        longitude: location.longitude,
      });
      mapRef.current?.animateToRegion(newRegion);
    }
  }, [getCurrentLocation, setThrottledMapCenterValue]);

  useEffect(() => {
    centerMapToCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Set initial map center and region when map loads
  useEffect(() => {
    if (initialRegion && !throttledMapCenter) {
      setThrottledMapCenterValue({
        latitude: initialRegion.latitude,
        longitude: initialRegion.longitude,
      });
      setCurrentRegion(initialRegion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isCheckingPermission) {
    return (
      <View
        style={[
          styles.container,
          {
            paddingBottom: bottomPadding,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <Text>Verificando permisos...</Text>
      </View>
    );
  }

  if (!hasLocationPermission) {
    return (
      <View
        style={[
          styles.container,
          {
            paddingBottom: bottomPadding,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <Text style={styles.permissionText}>
          Permiso de ubicación requerido para usar el mapa
        </Text>

        <Button title="Permitir ubicación" onPress={requestPermissions} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: bottomPadding, position: 'relative' },
      ]}
    >
      <MapView
        showsUserLocation={true}
        customMapStyle={mapStyle}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        ref={mapRef}
        zoomEnabled={true}
        initialRegion={initialRegion}
        onRegionChange={(newRegion) => {
          // Update current region immediately for viewport filtering (no API call)
          setCurrentRegion(newRegion);

          // Throttle the map center update (which triggers API call)
          setThrottledMapCenterValue({
            latitude: newRegion.latitude,
            longitude: newRegion.longitude,
          });
        }}
        // onRegionChangeComplete={(newRegion) => {
        //   console.log('onRegionChangeComplete', Date.now());
        //   // Update current region for viewport filtering
        //   setCurrentRegion(newRegion);

        //   setMapCenter({
        //     latitude: newRegion.latitude,
        //     longitude: newRegion.longitude,
        //   });
        // }}
        // onRegionChange={() => {
        //   if (scrollTimeoutRef.current) {
        //     clearTimeout(scrollTimeoutRef.current);
        //   }
        // }}
      >
        {visiblePins.map((pin, index) => (
          <AnimatedPinMarker key={pin.id} pin={pin} index={index} opacity={1} />
        ))}
      </MapView>
      {isLoadingPins && (
        <Animated.View
          style={styles.loadingContainer}
          entering={FadeIn.duration(120)}
          exiting={FadeOut.duration(120)}
        >
          <View>
            <ActivityIndicator size="small" color="rgba(201, 71, 38, 0.9)" />
          </View>
        </Animated.View>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={centerMapToCurrentLocation}>
          <IconCurrentLocation size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
