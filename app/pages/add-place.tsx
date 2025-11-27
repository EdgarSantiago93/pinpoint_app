import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  BackHandler,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import AddPlaceFlow from '@/components/add-place-flow';
import { ThemedView } from '@/components/themed-view';
import {
  AddPlaceFormData,
  useAddPlaceFormStore,
} from '@/stores/add-place-form-store';
import { useBottomNavigationStore } from '@/stores/bottom-navigation-store';
import { useToast } from '@/utils/toast';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddPlaceScreen() {
  const router = useRouter();
  const setVisible = useBottomNavigationStore((state) => state.setVisible);
  const resetFormData = useAddPlaceFormStore((state) => state.resetFormData);

  // Hide bottom navigation when this screen mounts
  useEffect(() => {
    setVisible(false);
    // Reset form and generate new random icon/color when page loads
    resetFormData();
    // Show it again when component unmounts
    return () => {
      setVisible(true);
    };
  }, [setVisible, resetFormData]);

  const { showToast } = useToast();

  const handleComplete = async (data: AddPlaceFormData) => {
    setTimeout(() => {
      resetFormData();
      router.back();
      showToast('Pin creado correctamente', 'success');
    }, 1000);
  };

  const handleCancel = () => {
    router.back();
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // Allow back navigation - the stepper will handle it
        return false;
      }
    );

    return () => backHandler.remove();
  }, []);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        Keyboard.dismiss();
      }}
      style={styles.container}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <ThemedView style={styles.container}>
          <AddPlaceFlow onComplete={handleComplete} onCancel={handleCancel} />
        </ThemedView>
      </SafeAreaView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
});
