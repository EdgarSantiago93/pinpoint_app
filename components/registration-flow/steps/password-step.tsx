import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { RegistrationFormData } from '@/stores/registration-form-store';
import { IconLock } from '@tabler/icons-react-native';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { styles } from '../styles';

const PasswordStepComponent = ({
  formData,
  onDataChange,
  onNext,
}: {
  formData: RegistrationFormData;
  onDataChange: (data: Partial<RegistrationFormData>) => void;
  onNext?: () => void;
}) => {
  const colors = Colors['light'];
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [errors, setErrors] = useState({
    password: '',
    passwordConfirmation: '',
  });

  const validatePassword = (password: string): string => {
    if (!password) {
      return 'La contraseña es requerida';
    }
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  };

  const validatePasswordConfirmation = (
    password: string,
    confirmation: string
  ): string => {
    if (!confirmation) {
      return 'Por favor confirma tu contraseña';
    }
    if (password !== confirmation) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  };

  const handlePasswordChange = (text: string) => {
    onDataChange({ password: text });
    const error = validatePassword(text);
    setErrors((prev) => ({ ...prev, password: error }));
    
    // Also revalidate confirmation if it exists
    if (formData.passwordConfirmation) {
      const confirmError = validatePasswordConfirmation(
        text,
        formData.passwordConfirmation
      );
      setErrors((prev) => ({ ...prev, passwordConfirmation: confirmError }));
    }
  };

  const handlePasswordConfirmationChange = (text: string) => {
    onDataChange({ passwordConfirmation: text });
    const error = validatePasswordConfirmation(formData.password, text);
    setErrors((prev) => ({ ...prev, passwordConfirmation: error }));
  };

  const handleNext = () => {
    const passwordError = validatePassword(formData.password);
    const confirmationError = validatePasswordConfirmation(
      formData.password,
      formData.passwordConfirmation
    );

    setErrors({
      password: passwordError,
      passwordConfirmation: confirmationError,
    });

    if (passwordError || confirmationError) {
      Toast.show({
        type: 'info',
        text1: 'Por favor corrige los errores',
        visibilityTime: 3000,
        position: 'top',
      });
      return;
    }

    onNext?.();
  };

  const isPasswordValid = formData.password.length >= 6 && !errors.password;
  const isConfirmationValid =
    formData.passwordConfirmation === formData.password &&
    formData.passwordConfirmation.length > 0;

  return (
    <View style={styles.stepContent}>
      <ThemedText type="title" style={styles.stepTitle}>
        Create Your Password
      </ThemedText>
      <ThemedText style={styles.stepDescription}>
        Choose a secure password for your account.
      </ThemedText>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Password</ThemedText>
        <View
          style={[
            styles.passwordInputContainer,
            {
              backgroundColor: colors.background,
              borderColor: errors.password
                ? '#E63946'
                : isPasswordValid
                ? '#2F9E44'
                : '#E0E0E0',
            },
          ]}
        >
          <IconLock size={20} color={colors.icon} strokeWidth={2} />
          <TextInput
            style={[styles.passwordInput, { color: colors.text }]}
            placeholder="••••••••"
            placeholderTextColor={colors.text + '80'}
            value={formData.password}
            onChangeText={handlePasswordChange}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="newPassword"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.passwordToggle}
          >
            <ThemedText style={styles.passwordToggleText}>
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </ThemedText>
          </TouchableOpacity>
        </View>
        {errors.password && (
          <ThemedText style={styles.validationError}>
            {errors.password}
          </ThemedText>
        )}
        {isPasswordValid && (
          <ThemedText style={styles.validationSuccess}>
            ✓ Contraseña válida
          </ThemedText>
        )}
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Confirm Password</ThemedText>
        <View
          style={[
            styles.passwordInputContainer,
            {
              backgroundColor: colors.background,
              borderColor: errors.passwordConfirmation
                ? '#E63946'
                : isConfirmationValid
                ? '#2F9E44'
                : '#E0E0E0',
            },
          ]}
        >
          <IconLock size={20} color={colors.icon} strokeWidth={2} />
          <TextInput
            style={[styles.passwordInput, { color: colors.text }]}
            placeholder="••••••••"
            placeholderTextColor={colors.text + '80'}
            value={formData.passwordConfirmation}
            onChangeText={handlePasswordConfirmationChange}
            secureTextEntry={!showPasswordConfirmation}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="newPassword"
          />
          <TouchableOpacity
            onPress={() =>
              setShowPasswordConfirmation(!showPasswordConfirmation)
            }
            style={styles.passwordToggle}
          >
            <ThemedText style={styles.passwordToggleText}>
              {showPasswordConfirmation ? 'Ocultar' : 'Mostrar'}
            </ThemedText>
          </TouchableOpacity>
        </View>
        {errors.passwordConfirmation && (
          <ThemedText style={styles.validationError}>
            {errors.passwordConfirmation}
          </ThemedText>
        )}
        {isConfirmationValid && (
          <ThemedText style={styles.validationSuccess}>
            ✓ Las contraseñas coinciden
          </ThemedText>
        )}
      </View>

      <View style={{ marginTop: 'auto', paddingBottom: 20 }}>
        <Button
          title="Next"
          onPress={handleNext}
          disabled={
            !formData.password ||
            !formData.passwordConfirmation ||
            !!errors.password ||
            !!errors.passwordConfirmation
          }
        />
      </View>
    </View>
  );
};

export default PasswordStepComponent;


