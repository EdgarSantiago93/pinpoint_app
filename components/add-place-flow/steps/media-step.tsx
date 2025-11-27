import MediaPicker from '@/components/media-picker';
import { ThemedText } from '@/components/themed-text';
import { AddPlaceFormData } from '@/stores/add-place-form-store';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const MediaStepComponent = ({
  formData,
  onDataChange,
}: {
  formData: AddPlaceFormData;
  onDataChange: (data: Partial<AddPlaceFormData>) => void;
}) => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <ThemedText type="title-serif" style={styles.stepTitle}>
        Fotos
      </ThemedText>
      <ThemedText style={styles.stepDescription}>
        Agrega fotos de tu visita, de la comida, con quien fuiste, etc.
      </ThemedText>

      <View style={styles.inputGroup}>
        <ThemedText type="defaultSemiBold" style={styles.label}>
          Fotos
        </ThemedText>
        <MediaPicker
          media={formData.media || []}
          onMediaChange={(media) => onDataChange({ media })}
          maxItems={5}
        />
      </View>
    </ScrollView>
  );
};

export default MediaStepComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    // paddingHorizontal: 20,
    // paddingBottom: 40,

    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    // backgroundColor: 'red',
    alignSelf: 'stretch',
    height: '100%',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
    fontSize: 17,
  },
  stepTitle: {
    fontSize: 28,
    marginBottom: 0,
  },
  stepDescription: {
    fontSize: 16,
    color: '#687076',
    marginBottom: 24,
  },
});
