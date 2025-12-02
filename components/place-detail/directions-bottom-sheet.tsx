import { ThemedText } from '@/components/themed-text';
import { Colors, nunito400regular, nunito700bold } from '@/constants/theme';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {
  IconBrandApple,
  IconBrandGoogle,
  IconBrandWaze,
} from '@tabler/icons-react-native';
import * as Linking from 'expo-linking';
import React, {
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface DirectionsBottomSheetRef {
  present: () => void;
  dismiss: () => void;
}

interface DirectionsBottomSheetProps {
  latitude: number;
  longitude: number;
  address?: string;
  title?: string;
}

export const DirectionsBottomSheet = React.forwardRef<
  DirectionsBottomSheetRef,
  DirectionsBottomSheetProps
>(({ latitude, longitude, address, title }, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => ['50%'], []);

  useImperativeHandle(ref, () => ({
    present: () => {
      bottomSheetRef.current?.snapToIndex(0);
    },
    dismiss: () => {
      bottomSheetRef.current?.close();
    },
  }));

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

  const openGoogleMaps = useCallback(() => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url).catch((err) => {
      console.error('Failed to open Google Maps:', err);
    });
    bottomSheetRef.current?.close();
  }, [latitude, longitude]);

  const openAppleMaps = useCallback(() => {
    const url = `http://maps.apple.com/?daddr=${latitude},${longitude}`;
    Linking.openURL(url).catch((err) => {
      console.error('Failed to open Apple Maps:', err);
    });
    bottomSheetRef.current?.close();
  }, [latitude, longitude]);

  const openWaze = useCallback(() => {
    const url = `waze://?ll=${latitude},${longitude}&navigate=yes`;
    Linking.openURL(url).catch((err) => {
      console.error('Failed to open Waze:', err);
      // Fallback to web version
      Linking.openURL(
        `https://www.waze.com/ul?ll=${latitude},${longitude}&navigate=yes`
      ).catch((webErr) => {
        console.error('Failed to open Waze web:', webErr);
      });
    });
    bottomSheetRef.current?.close();
  }, [latitude, longitude]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableContentPanningGesture
      enableHandlePanningGesture
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetView
        style={[styles.contentContainer, { paddingBottom: insets.bottom }]}
      >
        <View style={styles.header}>
          <ThemedText type="title-serif" style={styles.title}>
            Abrir en
          </ThemedText>
          {title && (
            <ThemedText type="dimmed" style={styles.subtitle}>
              {title}
            </ThemedText>
          )}
        </View>

        <View style={styles.optionsContainer}>
          {/* Google Maps */}
          <TouchableOpacity
            style={styles.option}
            onPress={openGoogleMaps}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <View
                style={[styles.iconContainer, { backgroundColor: '#4285F4' }]}
              >
                <IconBrandGoogle size={24} color="white" />
              </View>
              <View style={styles.optionTextContainer}>
                <ThemedText style={styles.optionTitle}>Google Maps</ThemedText>
              </View>
            </View>
          </TouchableOpacity>

          {/* Apple Maps */}
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={styles.option}
              onPress={openAppleMaps}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View
                  style={[styles.iconContainer, { backgroundColor: '#000000' }]}
                >
                  <IconBrandApple size={24} color="white" />
                </View>
                <View style={styles.optionTextContainer}>
                  <ThemedText style={styles.optionTitle}>Apple Maps</ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          )}

          {/* Waze */}
          <TouchableOpacity
            style={styles.option}
            onPress={openWaze}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <View
                style={[styles.iconContainer, { backgroundColor: '#33CCFF' }]}
              >
                <IconBrandWaze size={24} color="white" />
              </View>
              <View style={styles.optionTextContainer}>
                <ThemedText style={styles.optionTitle}>Waze</ThemedText>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

DirectionsBottomSheet.displayName = 'DirectionsBottomSheet';

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },

  handleIndicator: {
    backgroundColor: '#E0E0E0',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  optionsContainer: {
    gap: 8,
  },
  option: {
    borderRadius: 12,
    padding: 8,
    // borderColor: '#EAEAEA',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: nunito700bold,
    color: Colors.light.text,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
    fontFamily: nunito400regular,
  },
  wazeIcon: {
    fontSize: 24,
    fontFamily: nunito700bold,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
