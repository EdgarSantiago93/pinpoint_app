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
  },
  stepWrapper: {
    flex: 1,
    alignSelf: 'stretch',
    width: '100%',
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
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    padding: 0,
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
  // Code input specific styles
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginVertical: 24,
  },
  codeInput: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: Colors.light.text,
  },
  codeInputFocused: {
    borderColor: '#912121',
    backgroundColor: '#FFF',
  },
  codeInputFilled: {
    borderColor: '#912121',
    backgroundColor: '#FFF',
  },
  resendCodeContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  resendCodeText: {
    fontSize: 14,
    color: '#687076',
  },
  resendCodeButton: {
    marginTop: 8,
  },
  resendCodeButtonText: {
    fontSize: 14,
    color: '#912121',
    fontWeight: '600',
  },
  // Password validation styles
  passwordInputContainer: {
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
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    padding: 0,
  },
  passwordToggle: {
    padding: 4,
  },
  passwordToggleText: {
    fontSize: 14,
    color: '#912121',
    fontWeight: '600',
  },
  validationError: {
    fontSize: 12,
    color: '#E63946',
    marginTop: 4,
  },
  validationSuccess: {
    fontSize: 12,
    color: '#2F9E44',
    marginTop: 4,
  },
  // Success step styles
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2F9E44',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  successDescription: {
    fontSize: 16,
    color: '#687076',
    textAlign: 'center',
    marginBottom: 32,
  },
});
