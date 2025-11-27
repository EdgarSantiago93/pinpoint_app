import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { RegistrationFormData } from '@/stores/registration-form-store';
import { IconMail } from '@tabler/icons-react-native';
import { useState } from 'react';
import { Keyboard, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { styles } from '../styles';

const EmailStepComponent = ({
  formData,
  onDataChange,
  onNext,
}: {
  formData: RegistrationFormData;
  onDataChange: (data: Partial<RegistrationFormData>) => void;
  onNext?: () => void;
}) => {
  const colors = Colors['light'];
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendCode = async () => {
    if (!formData.email.trim()) {
      Toast.show({
        type: 'info',
        text1: 'Por favor ingresa tu email',
        visibilityTime: 3000,
        position: 'top',
      });
      return;
    }

    if (!validateEmail(formData.email.trim())) {
      Toast.show({
        type: 'info',
        text1: 'Por favor ingresa un email válido',
        visibilityTime: 3000,
        position: 'top',
      });
      return;
    }

    setIsLoading(true);
    Keyboard.dismiss();

    // Mock: Simulate sending verification code
    setTimeout(() => {
      setIsLoading(false);
      setCodeSent(true);
      Toast.show({
        type: 'success',
        text1: 'Código enviado',
        text2: 'Revisa tu email para el código de verificación',
        visibilityTime: 3000,
        position: 'top',
      });
    }, 1000);
  };

  const handleContinue = () => {
    if (!codeSent) {
      handleSendCode();
      return;
    }
    onNext?.();
  };

  return (
    <View style={styles.stepContent}>
      <ThemedText type="title" style={styles.stepTitle}>
        Empecemos!
      </ThemedText>
      <ThemedText style={styles.stepDescription}>
        Enter your email to create your account or sign in.
      </ThemedText>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Email</ThemedText>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.background,
              borderColor: codeSent ? '#2F9E44' : '#E0E0E0',
            },
          ]}
        >
          <IconMail size={20} color={colors.icon} strokeWidth={2} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="tu@email.com"
            placeholderTextColor={colors.text + '80'}
            value={formData.email}
            onChangeText={(text) => {
              onDataChange({ email: text });
              setCodeSent(false);
            }}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            editable={!isLoading && !codeSent}
          />
        </View>
        {codeSent && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 12,
              padding: 12,
              backgroundColor: '#E8F5E9',
              borderRadius: 8,
              gap: 8,
            }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: '#2F9E44',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ThemedText style={{ color: '#FFF', fontSize: 12 }}>✓</ThemedText>
            </View>
            <ThemedText style={{ fontSize: 14, color: '#2F9E44' }}>
              A confirmation link has been sent to your email
            </ThemedText>
          </View>
        )}
        {!codeSent && (
          <ThemedText
            style={{
              fontSize: 12,
              color: colors.text + '80',
              marginTop: 8,
            }}
          >
            We'll check if you already have an account.
          </ThemedText>
        )}
      </View>

      <View style={{ marginTop: 'auto', paddingBottom: 20 }}>
        <Button
          title={codeSent ? 'Continue' : 'Send Code'}
          onPress={handleContinue}
          loading={isLoading}
          disabled={isLoading || (!formData.email.trim() && !codeSent)}
        />
      </View>
    </View>
  );
};

export default EmailStepComponent;
