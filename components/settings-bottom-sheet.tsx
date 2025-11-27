import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/stores/auth-store';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { IconFileText, IconLogout } from '@tabler/icons-react-native';
import Constants from 'expo-constants';
import React, { useCallback, useRef } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export interface SettingsBottomSheetRef {
  present: () => void;
  dismiss: () => void;
}

export const SettingsBottomSheet = React.forwardRef<SettingsBottomSheetRef, {}>(
  (props, ref) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const logout = useAuthStore((state) => state.logout);

    React.useImperativeHandle(ref, () => ({
      present: () => {
        bottomSheetModalRef.current?.present();
      },
      dismiss: () => {
        bottomSheetModalRef.current?.dismiss();
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

    const performLogout = useCallback(async () => {
      try {
        await logout();
        bottomSheetModalRef.current?.dismiss();
        Toast.show({
          type: 'success',
          text1: 'Sesión cerrada',
          text2: 'Has cerrado sesión correctamente',
        });
      } catch (error) {
        console.error('Logout error:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No se pudo cerrar sesión',
        });
      }
    }, [logout]);

    const handleLogout = useCallback(() => {
      Alert.alert(
        'Cerrar sesión',
        '¿Estás seguro de que quieres cerrar sesión?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Cerrar sesión',
            style: 'destructive',
            onPress: performLogout,
          },
        ]
      );
    }, [performLogout]);

    const handleReleaseNotes = useCallback(() => {
      // TODO: Implement release notes navigation or modal
      Toast.show({
        type: 'info',
        text1: 'Notas de versión',
        text2: 'Próximamente',
      });
    }, []);

    const appVersion =
      Constants.expoConfig?.version ||
      Constants.manifest2?.extra?.expoClient?.version ||
      '1.0.0';

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={['50%']}
        enablePanDownToClose={true}
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.handleIndicator}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.contentContainer}>
          <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <ThemedText type="title-serif" style={styles.title}>
              Configuración
            </ThemedText>

            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              {/* Release Notes */}
              <TouchableOpacity
                style={styles.option}
                onPress={handleReleaseNotes}
                activeOpacity={0.7}
              >
                <View style={styles.optionLeft}>
                  <View style={styles.iconContainer}>
                    <IconFileText size={24} color={Colors.light.tint} />
                  </View>
                  <ThemedText style={styles.optionText}>
                    Notas de versión
                  </ThemedText>
                </View>
              </TouchableOpacity>

              {/* Logout */}
              <TouchableOpacity
                style={[styles.option, styles.logoutOption]}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <View style={styles.optionLeft}>
                  <View style={styles.iconContainer}>
                    <IconLogout size={24} color="#EF4444" />
                  </View>
                  <ThemedText style={[styles.optionText, styles.logoutText]}>
                    Cerrar sesión
                  </ThemedText>
                </View>
              </TouchableOpacity>

              {/* App Version */}
              <View style={styles.versionContainer}>
                <ThemedText type="dimmed" style={styles.versionText}>
                  Versión {appVersion}
                </ThemedText>
              </View>
            </ScrollView>
          </SafeAreaView>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

SettingsBottomSheet.displayName = 'SettingsBottomSheet';

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'white',
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
  },
  safeArea: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  logoutOption: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  logoutText: {
    color: '#EF4444',
  },
  versionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
