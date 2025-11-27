import { nunito400regular, nunito600semibold } from '@/constants/theme';
import { useLocation } from '@/hooks/use-location';
import { IconLocation } from '@tabler/icons-react-native';
import { getPermissionsAsync, requestPermissionsAsync } from 'expo-maps';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Types
interface Pin {
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
  // ... other pin properties
}

interface Cluster {
  id: string;
  latitude: number;
  longitude: number;
  count: number;
  pins: Pin[];
}

interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 20) + 80;

  const [region, setRegion] = useState<MapRegion>({
    latitude: 37.7749, // Default to San Francisco, or get user location
    longitude: -122.4194,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const [allPins, setAllPins] = useState<Pin[]>([]); // All 500 pins
  const [visiblePins, setVisiblePins] = useState<Pin[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);

  // Calculate viewport bounds
  const getViewportBounds = (reg: MapRegion) => {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = reg;
    return {
      minLat: latitude - latitudeDelta / 2,
      maxLat: latitude + latitudeDelta / 2,
      minLng: longitude - longitudeDelta / 2,
      maxLng: longitude + longitudeDelta / 2,
    };
  };

  // Filter pins within viewport
  const filterPinsInViewport = useCallback((pins: Pin[], reg: MapRegion) => {
    const bounds = getViewportBounds(reg);
    return pins.filter(
      (pin) =>
        pin.latitude >= bounds.minLat &&
        pin.latitude <= bounds.maxLat &&
        pin.longitude >= bounds.minLng &&
        pin.longitude <= bounds.maxLng
    );
  }, []);

  // Clustering algorithm (simple grid-based clustering)
  const clusterPins = useCallback(
    (pins: Pin[], zoomLevel: number): Cluster[] => {
      // Determine cluster size based on zoom level
      // Higher zoom = smaller clusters (show more individual pins)
      const clusterSize = zoomLevel < 0.01 ? 0.002 : 0.005; // Adjust these values

      const clusters: Map<string, Cluster> = new Map();

      pins.forEach((pin) => {
        // Calculate grid cell for this pin
        const gridX = Math.floor(pin.latitude / clusterSize);
        const gridY = Math.floor(pin.longitude / clusterSize);
        const clusterKey = `${gridX}_${gridY}`;

        if (clusters.has(clusterKey)) {
          const cluster = clusters.get(clusterKey)!;
          cluster.pins.push(pin);
          cluster.count++;
          // Update cluster center (average of all pins)
          cluster.latitude =
            cluster.pins.reduce((sum, p) => sum + p.latitude, 0) /
            cluster.pins.length;
          cluster.longitude =
            cluster.pins.reduce((sum, p) => sum + p.longitude, 0) /
            cluster.pins.length;
        } else {
          clusters.set(clusterKey, {
            id: clusterKey,
            latitude: pin.latitude,
            longitude: pin.longitude,
            count: 1,
            pins: [pin],
          });
        }
      });

      return Array.from(clusters.values());
    },
    []
  );

  // Update visible pins and clusters when region changes
  const handleRegionChangeComplete = useCallback(
    (newRegion: MapRegion) => {
      console.log('newRegion', newRegion);
      setRegion(newRegion);

      // Filter pins in viewport
      const filtered = filterPinsInViewport(allPins, newRegion);
      setVisiblePins(filtered);

      // Cluster the filtered pins
      const zoomLevel = newRegion.latitudeDelta;
      const clustered = clusterPins(filtered, zoomLevel);
      setClusters(clustered);
    },
    [allPins, filterPinsInViewport, clusterPins]
  );

  // Determine what to render: clusters or individual pins
  const renderItems = useMemo(() => {
    const zoomLevel = region.latitudeDelta;

    // If zoomed in enough, show individual pins
    if (zoomLevel < 0.005) {
      return {
        type: 'pins' as const,
        items: visiblePins,
      };
    }

    // Otherwise show clusters
    return {
      type: 'clusters' as const,
      items: clusters,
    };
  }, [visiblePins, clusters, region.latitudeDelta]);

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
          'Location Permission Required',
          'Please enable location permissions in your device settings to use the map features.',
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
  const { getCurrentLocation, loading: locationLoading } = useLocation();

  const centerMapToCurrentLocation = useCallback(async () => {
    console.log('centerMapToCurrentLocation');
    const location = await getCurrentLocation();
    if (location) {
      const newRegion = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion);
      // handleRegionChangeComplete(region);
    }
  }, [getCurrentLocation, handleRegionChangeComplete, region]);

  // const zoomIn = () => {
  //   mapRef.current?.animateToRegion({
  //     latitude: region.latitude,
  //     longitude: region.longitude,
  //     latitudeDelta: region.latitudeDelta * 0.5, // Zoom in by 50%
  //     longitudeDelta: region.longitudeDelta * 0.5,
  //   });
  // };
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
        <Text>Checking permissions...</Text>
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
          Location permission is required to use the map
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermissions}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const mp = [
    {
      elementType: 'geometry',
      stylers: [
        {
          color: '#ebe3cd',
        },
      ],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#523735',
        },
      ],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#f5f1e6',
        },
      ],
    },
    {
      featureType: 'administrative',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#c9b2a6',
        },
      ],
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#dcd2be',
        },
      ],
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#ae9e90',
        },
      ],
    },
    {
      featureType: 'landscape.natural',
      elementType: 'geometry',
      stylers: [
        {
          color: '#dfd2ae',
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        {
          color: '#dfd2ae',
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#93817c',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#a5b076',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#447530',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        {
          color: '#f5f1e6',
        },
      ],
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [
        {
          color: '#fdfcf8',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [
        {
          color: '#f8c967',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#e9bc62',
        },
      ],
    },
    {
      featureType: 'road.highway.controlled_access',
      elementType: 'geometry',
      stylers: [
        {
          color: '#e98d58',
        },
      ],
    },
    {
      featureType: 'road.highway.controlled_access',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#db8555',
        },
      ],
    },
    {
      featureType: 'road.local',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#806b63',
        },
      ],
    },
    {
      featureType: 'transit.line',
      elementType: 'geometry',
      stylers: [
        {
          color: '#dfd2ae',
        },
      ],
    },
    {
      featureType: 'transit.line',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#8f7d77',
        },
      ],
    },
    {
      featureType: 'transit.line',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#ebe3cd',
        },
      ],
    },
    {
      featureType: 'transit.station',
      elementType: 'geometry',
      stylers: [
        {
          color: '#dfd2ae',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#b9d3c2',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#92998d',
        },
      ],
    },
  ];
  return (
    <View
      style={[
        styles.container,
        { paddingBottom: bottomPadding, position: 'relative' },
      ]}
    >
      <MapView
        showsUserLocation={true}
        customMapStyle={mp}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        ref={mapRef}
        zoomEnabled={true}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={centerMapToCurrentLocation}>
          <IconLocation size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',

    right: 0,
    top: 50,

    backgroundColor: 'red',
    zIndex: 1000,
  },
  container: {
    flex: 1,
    // ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // position: 'relative',
  },
  // map: {
  //   flex: 1,
  // },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  clusterMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  clusterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'NunitoSans_700Bold',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    fontFamily: nunito400regular,
  },
  permissionButton: {
    padding: 12,
    paddingHorizontal: 24,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    overflow: 'hidden',
  },
  permissionButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    fontFamily: nunito600semibold,
  },
});
