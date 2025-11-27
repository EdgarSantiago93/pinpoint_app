import AspectList from '@/components/aspect-list';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { AddPlaceFormData } from '@/stores/add-place-form-store';
import { IconInfoCircle, IconPlus, IconX } from '@tabler/icons-react-native';
import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import {
  LayoutAnimation,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const AspectsStepComponent = ({
  formData,
  onDataChange,
}: {
  formData: AddPlaceFormData;
  onDataChange: (data: Partial<AddPlaceFormData>) => void;
}) => {
  const [isAddingMust, setIsAddingMust] = useState(false);
  const [newMustText, setNewMustText] = useState('');
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const musts = formData.musts || [];
  const colors = Colors['light'];
  const opacity = useSharedValue(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const mustContainerRef = useRef<View>(null);

  // Animation duration in milliseconds
  const ANIMATION_DURATION = 220;

  useEffect(() => {
    if (showInfoDialog) {
      opacity.value = withTiming(1, { duration: ANIMATION_DURATION });
    } else {
      opacity.value = withTiming(0, { duration: ANIMATION_DURATION });
    }
  }, [showInfoDialog, opacity]);

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        {
          scale: 0.9 + opacity.value * 0.1, // Slight scale animation
        },
      ],
    };
  });

  const handleAddMust = () => {
    if (newMustText.trim()) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const updatedMusts = [...musts, newMustText.trim()];
      onDataChange({ musts: updatedMusts });
      setNewMustText('');
      setIsAddingMust(false);
    }
  };

  const handleRemoveMust = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const updatedMusts = musts.filter((_, i) => i !== index);
    onDataChange({ musts: updatedMusts });
  };

  const handleCancelAdd = () => {
    setNewMustText('');
    setIsAddingMust(false);
  };

  const handleMustFocus = () => {
    // Scroll to bottom to show the textarea above keyboard
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  // Scroll to bottom when container becomes visible
  useEffect(() => {
    if (isAddingMust) {
      // Delay to ensure keyboard animation starts
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  }, [isAddingMust]);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.stepContent}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <ThemedText type="title-serif" style={styles.stepTitle}>
        Detalles
        <Text style={{ fontSize: 16 }}> (opcional)</Text>
      </ThemedText>
      <ThemedText style={styles.stepDescription}>
        Agrega detalles importantes para que otros usuarios puedan encontrar
        este lugar.
      </ThemedText>
      {/* Aspect List */}
      <AspectList
        aspects={formData.aspects}
        onAspectsChange={(aspectIds) => onDataChange({ aspects: aspectIds })}
      />
      {/* Musts Section */}
      <View style={styles.mustsSection}>
        <View style={styles.mustsHeader}>
          <View style={styles.mustsTitleContainer}>
            <ThemedText type="subtitle">Must knows</ThemedText>
            <TouchableOpacity
              onPress={() => setShowInfoDialog(true)}
              style={styles.infoButton}
            >
              <IconInfoCircle size={22} color={colors.tint} />
            </TouchableOpacity>
          </View>

          {!isAddingMust && (
            <TouchableOpacity
              onPress={() => setIsAddingMust(true)}
              style={styles.addButton}
              activeOpacity={0.7}
            >
              <IconPlus size={20} color={Colors['light'].tint} />
            </TouchableOpacity>
          )}
        </View>

        {/* Musts List */}
        {musts.length > 0 ? (
          <View style={styles.mustsList}>
            {musts.map((must, index) => (
              <View key={index} style={styles.mustItem}>
                <ThemedText style={styles.mustText}>{must}</ThemedText>
                <TouchableOpacity
                  onPress={() => handleRemoveMust(index)}
                  style={styles.removeButton}
                  activeOpacity={0.7}
                >
                  <IconX size={18} color={Colors['light'].icon} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.mustItemEmpty}>
            <ThemedText
              style={[
                styles.mustText,
                { textAlign: 'center', color: Colors['light'].text + '90' },
              ]}
            >
              Agrega ese *algo* que debes saber
            </ThemedText>
          </View>
        )}

        {/* Add Must Input */}
        {isAddingMust && (
          <View ref={mustContainerRef} style={styles.addMustContainer}>
            <TextInput
              style={styles.mustInput}
              placeholder="Agrega algo que debes saber..."
              placeholderTextColor={Colors['light'].icon}
              value={newMustText}
              onChangeText={setNewMustText}
              onFocus={handleMustFocus}
              multiline
              autoFocus
              textAlignVertical="top"
              autoCorrect={false}
              autoComplete="off"
              autoCapitalize="sentences"
            />
            <View style={styles.addMustActions}>
              <TouchableOpacity
                onPress={handleCancelAdd}
                style={styles.cancelButton}
                activeOpacity={0.7}
              >
                <ThemedText style={styles.cancelButtonText}>
                  Cancelar
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddMust}
                style={[
                  styles.saveButton,
                  !newMustText.trim() && styles.saveButtonDisabled,
                ]}
                activeOpacity={0.7}
                disabled={!newMustText.trim()}
              >
                <ThemedText style={styles.saveButtonText}>Agregar</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Info Dialog Modal */}
      <Modal
        visible={showInfoDialog}
        transparent
        animationType="none"
        onRequestClose={() => setShowInfoDialog(false)}
      >
        <Animated.View style={[styles.modalOverlay, overlayAnimatedStyle]}>
          <Animated.View style={[styles.modalContent, contentAnimatedStyle]}>
            <View style={{ width: '100%' }}>
              <ThemedText type="title-serif" style={styles.modalTitle}>
                Must know
              </ThemedText>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowInfoDialog(false)}
            >
              <IconX size={24} color={colors.text} />
            </TouchableOpacity>

            <ThemedText style={styles.modalText}>
              Agrega información importante que otros usuarios deben conocer
              sobre este lugar. Por ejemplo: &quot;El creme brulé es
              increible&quot;, &quot;Pide una mesa a lado de la ventana&quot;,
              etc.
            </ThemedText>

            {/* GIF/Image - replace with your actual image path or URL */}
            <View style={styles.gifContainer}>
              <Image
                source={require('@/assets/media/mk.png')}
                style={styles.gif}
                contentFit="contain"
                placeholder={{ blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
              />
            </View>

            <TouchableOpacity
              style={[styles.okButton, { backgroundColor: colors.tint }]}
              onPress={() => setShowInfoDialog(false)}
            >
              <ThemedText style={styles.okButtonText}>Ok</ThemedText>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Modal>
    </ScrollView>
  );
};

export default AspectsStepComponent;

const styles = StyleSheet.create({
  stepContent: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  stepTitle: {
    fontSize: 28,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#687076',
    marginBottom: 24,
  },
  mustsSection: {
    marginBottom: 32,
  },
  mustsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mustsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoButton: {
    padding: 4,
  },
  mustsTitle: {
    fontSize: 18,
    color: Colors['light'].text,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors['light'].tint + '20',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors['light'].tint,
  },
  mustsList: {
    gap: 8,
  },
  mustItemEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors['light'].tint,
    borderStyle: 'dashed',
    backgroundColor: Colors['light'].tint + '10',
    textAlign: 'center',
  },
  mustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  mustText: {
    flex: 1,
    fontSize: 15,
    color: Colors['light'].text,
  },
  removeButton: {
    padding: 4,
    marginLeft: 8,
  },
  addMustContainer: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors['light'].tint + '99',
  },
  mustInput: {
    minHeight: 80,
    fontSize: 15,
    color: Colors['light'].text,
    padding: 0,
    marginBottom: 12,
  },
  addMustActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelButtonText: {
    fontSize: 15,
    color: Colors['light'].icon,
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors['light'].tint,
    borderRadius: 6,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    position: 'relative',
  },
  modalTitle: {
    fontSize: 32,
    marginBottom: 16,
    color: Colors['light'].text,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#687076',
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 4,
    zIndex: 1,
  },
  gifContainer: {
    width: '100%',
    height: 200,
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  gif: {
    width: '100%',
    height: '100%',
  },
  okButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  okButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
