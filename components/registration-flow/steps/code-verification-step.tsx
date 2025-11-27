import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { RegistrationFormData } from '@/stores/registration-form-store';
import { useRef, useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';

const CodeVerificationStepComponent = ({
  formData,
  onDataChange,
  onNext,
}: {
  formData: RegistrationFormData;
  onDataChange: (data: Partial<RegistrationFormData>) => void;
  onNext?: () => void;
}) => {
  const colors = Colors['light'];
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    // Initialize code from formData if it exists
    if (formData.verificationCode && formData.verificationCode.length === 6) {
      setCode(formData.verificationCode.split(''));
    }
  }, []);

  useEffect(() => {
    // Countdown timer for resend
    if (resendTimer > 0 && !canResend) {
      const timer = setTimeout(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [resendTimer, canResend]);

  const handleCodeChange = (value: string, index: number) => {
    // Only allow digits
    const digit = value.replace(/[^0-9]/g, '');
    if (digit.length > 1) return;

    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    // Update form data
    const codeString = newCode.join('');
    onDataChange({ verificationCode: codeString });

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all fields are filled, verify code
    if (newCode.every((c) => c !== '') && newCode.join('').length === 6) {
      // Mock verification - accept any 6-digit code
      setTimeout(() => {
        onNext?.();
      }, 300);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = () => {
    setResendTimer(60);
    setCanResend(false);
    setCode(['', '', '', '', '', '']);
    onDataChange({ verificationCode: '' });
    inputRefs.current[0]?.focus();
    // Mock: Code would be resent here
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.stepContent}>
      <ThemedText type="title" style={styles.stepTitle}>
        Verify Your Email
      </ThemedText>
      <ThemedText style={styles.stepDescription}>
        We've sent a 6-digit code to your email. Enter it below to continue.
      </ThemedText>

      <View style={styles.codeInputContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            style={[
              styles.codeInput,
              {
                borderColor:
                  digit !== ''
                    ? '#912121'
                    : code.some((c) => c !== '')
                    ? '#E0E0E0'
                    : '#E0E0E0',
                backgroundColor: digit !== '' ? '#FFF' : '#F5F5F5',
              },
            ]}
            value={digit}
            onChangeText={(value) => handleCodeChange(value, index)}
            onKeyPress={({ nativeEvent }) =>
              handleKeyPress(nativeEvent.key, index)
            }
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            autoFocus={index === 0}
          />
        ))}
      </View>

      <View style={styles.resendCodeContainer}>
        {!canResend ? (
          <ThemedText style={styles.resendCodeText}>
            Resend code in {formatTime(resendTimer)}
          </ThemedText>
        ) : (
          <TouchableOpacity
            onPress={handleResendCode}
            style={styles.resendCodeButton}
          >
            <ThemedText style={styles.resendCodeButtonText}>
              Resend code
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CodeVerificationStepComponent;


