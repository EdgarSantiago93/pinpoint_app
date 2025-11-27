import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { RegistrationFormData } from '@/stores/registration-form-store';
import { generateUsernameFromName } from '@/utils/username-generator';
import { IconAt } from '@tabler/icons-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { styles } from '../styles';

const UsernameStepComponent = ({
  formData,
  onDataChange,
  onNext,
}: {
  formData: RegistrationFormData;
  onDataChange: (data: Partial<RegistrationFormData>) => void;
  onNext?: () => void;
}) => {
  const colors = Colors['light'];
  const [error, setError] = useState('');
  const [isManuallyEdited, setIsManuallyEdited] = useState(false);

  useEffect(() => {
    // Generate username from name if not manually edited and name exists
    if (!isManuallyEdited && formData.name && !formData.username) {
      const generated = generateUsernameFromName(formData.name);
      onDataChange({ username: generated });
    }
  }, [formData.name, isManuallyEdited]);

  const handleUsernameChange = (text: string) => {
    // Remove spaces and special characters, keep only alphanumeric and underscore
    const cleaned = text.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
    onDataChange({ username: cleaned });
    setIsManuallyEdited(true);
    
    if (error) setError('');
  };

  const handleRegenerate = () => {
    if (formData.name) {
      const generated = generateUsernameFromName(formData.name);
      onDataChange({ username: generated });
      setIsManuallyEdited(false);
      setError('');
    }
  };

  const handleNext = () => {
    const trimmedUsername = formData.username.trim();
    
    if (!trimmedUsername) {
      setError('Por favor ingresa un nombre de usuario');
      Toast.show({
        type: 'info',
        text1: 'Usuario requerido',
        text2: 'Por favor ingresa un nombre de usuario',
        visibilityTime: 3000,
        position: 'top',
      });
      return;
    }

    if (trimmedUsername.length < 3) {
      setError('El usuario debe tener al menos 3 caracteres');
      return;
    }

    setError('');
    onNext?.();
  };

  return (
    <View style={styles.stepContent}>
      <ThemedText type="title" style={styles.stepTitle}>
        Choose Your Username
      </ThemedText>
      <ThemedText style={styles.stepDescription}>
        We've generated a username for you, but you can edit it if you'd like.
      </ThemedText>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Username</ThemedText>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.background,
              borderColor: error ? '#E63946' : '#E0E0E0',
            },
          ]}
        >
          <IconAt size={20} color={colors.icon} strokeWidth={2} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="nombre_usuario"
            placeholderTextColor={colors.text + '80'}
            value={formData.username}
            onChangeText={handleUsernameChange}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="username"
          />
        </View>
        {error && (
          <ThemedText style={styles.validationError}>{error}</ThemedText>
        )}
        {!error && formData.username && (
          <ThemedText
            style={{
              fontSize: 12,
              color: colors.text + '80',
              marginTop: 4,
            }}
          >
            Your username will be: @{formData.username}
          </ThemedText>
        )}
        {isManuallyEdited && formData.name && (
          <View style={{ marginTop: 8 }}>
            <ThemedText
              style={{
                fontSize: 12,
                color: '#912121',
                textDecorationLine: 'underline',
              }}
              onPress={handleRegenerate}
            >
              Regenerate from name
            </ThemedText>
          </View>
        )}
      </View>

      <View style={{ marginTop: 'auto', paddingBottom: 20 }}>
        <Button
          title="Next"
          onPress={handleNext}
          disabled={!formData.username.trim() || formData.username.length < 3}
        />
      </View>
    </View>
  );
};

export default UsernameStepComponent;


