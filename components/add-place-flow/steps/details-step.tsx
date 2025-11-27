import MediaPicker from '@/components/media-picker';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { AddPlaceFormData } from '@/stores/add-place-form-store';
import { IconMapPin, IconTag } from '@tabler/icons-react-native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';

const DetailsStepComponent = ({
  formData,
  onDataChange,
}: {
  formData: AddPlaceFormData;
  onDataChange: (data: Partial<AddPlaceFormData>) => void;
}) => {
  return (
    // <SafeAreaView style={styles.container}>
    <ScrollView
      style={styles.stepContent}
      contentContainerStyle={styles.detailsScrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <ThemedText type="title-serif" style={styles.stepTitle}>
        Add details
      </ThemedText>
      <ThemedText style={styles.stepDescription}>
        Tell us more about this place
      </ThemedText>

      {/* Name Input */}
      <View style={styles.inputGroup}>
        <ThemedText type="defaultSemiBold" style={styles.label}>
          Name *
        </ThemedText>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter place name"
            placeholderTextColor={Colors['light'].icon}
            value={formData.name}
            onChangeText={(value) => onDataChange({ name: value })}
          />
        </View>
      </View>

      {/* Description Input */}
      <View style={styles.inputGroup}>
        <ThemedText type="defaultSemiBold" style={styles.label}>
          Description
        </ThemedText>
        <View style={[styles.inputContainer, styles.textAreaContainer]}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add a description..."
            placeholderTextColor={Colors['light'].icon}
            value={formData.description}
            onChangeText={(value) => onDataChange({ description: value })}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>

      {/* Address Input */}
      <View style={styles.inputGroup}>
        <ThemedText type="defaultSemiBold" style={styles.label}>
          Address
        </ThemedText>
        <TouchableOpacity
          style={styles.inputContainer}
          activeOpacity={0.7}
          onPress={() => {
            // TODO: Open map picker or location selector
          }}
        >
          <IconMapPin size={20} color={Colors['light'].tint} strokeWidth={2} />
          <TextInput
            style={[styles.input, styles.inputWithIcon]}
            placeholder="Select location"
            placeholderTextColor={Colors['light'].icon}
            value={formData.address || formData.placeData?.address || ''}
            onChangeText={(value) => onDataChange({ address: value })}
            editable={false}
          />
        </TouchableOpacity>
      </View>

      {/* Tags Input */}
      <View style={styles.inputGroup}>
        <ThemedText type="defaultSemiBold" style={styles.label}>
          Tags
        </ThemedText>
        <View style={styles.inputContainer}>
          <IconTag size={20} color={Colors['light'].tint} strokeWidth={2} />
          <TextInput
            style={[styles.input, styles.inputWithIcon]}
            placeholder="Add tags (comma separated)"
            placeholderTextColor={Colors['light'].icon}
            value={formData.tags}
            onChangeText={(value) => onDataChange({ tags: value })}
          />
        </View>
      </View>

      {/* Photo Section */}
      <View style={styles.inputGroup}>
        <ThemedText type="defaultSemiBold" style={styles.label}>
          Photos
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

export default DetailsStepComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  stepIndicators: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    gap: 8,
  },
  stepIndicatorContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  stepIndicatorWrapper: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  stepIndicatorActive: {
    backgroundColor: '#FFF',
    borderColor: '#912121',
  },
  stepIndicatorCompleted: {
    backgroundColor: '#912121',
    borderColor: '#912121',
  },
  stepIndicatorText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  stepIndicatorLineContainer: {
    position: 'absolute',
    top: 15,
    left: '50%',
    right: '-50%',
    height: 2,
    zIndex: 1,
    transform: [{ translateX: 16 }],
    overflow: 'hidden',
  },
  stepIndicatorLineBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  stepIndicatorLineFill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#912121',
  },
  stepIndicatorLabel: {
    fontSize: 11,
    color: '#687076',
    textAlign: 'center',
  },
  stepIndicatorLabelActive: {
    color: '#912121',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'blue',
  },
  stepWrapper: {
    flex: 1,
  },
  stepContent: {
    flex: 1,
    padding: 20,
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
  detailsScrollContent: {
    paddingBottom: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 12,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    padding: 0,
  },
  inputWithIcon: {
    marginLeft: 0,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 0,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    gap: 8,
  },
  photoButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#912121',
  },
  backButtonTextDisabled: {
    color: '#687076',
  },
  nextButton: {
    flex: 1,
  },
});
