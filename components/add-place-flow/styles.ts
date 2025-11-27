import { Colors } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  stepIndicators: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 4,

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
    backgroundColor: Colors.light.background,
    borderColor: Colors.light.tint,
  },
  stepIndicatorCompleted: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
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
    backgroundColor: Colors.light.tint,
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
    // backgroundColor: 'blue',
  },
  stepWrapper: {
    flex: 1,
    alignSelf: 'stretch',
    width: '100%', // Add this
    height: '100%',
  },
  stepContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
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
