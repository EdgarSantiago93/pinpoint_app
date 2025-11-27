import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { RegistrationFormData } from '@/stores/registration-form-store';
import { IconUser } from '@tabler/icons-react-native';
import { useState } from 'react';
import { TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { styles } from '../styles';

const NameStepComponent = ({
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

  const handleNext = () => {
    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      setError('Por favor ingresa tu nombre');
      Toast.show({
        type: 'info',
        text1: 'Nombre requerido',
        text2: 'Por favor ingresa tu nombre',
        visibilityTime: 3000,
        position: 'top',
      });
      return;
    }

    if (trimmedName.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }

    setError('');
    onNext?.();
  };

  return (
    <View style={styles.stepContent}>
      <ThemedText type="title" style={styles.stepTitle}>
        Tell Us Your First Name
      </ThemedText>
      <ThemedText style={styles.stepDescription}>
        So we can address you properly in your daily reminders.
      </ThemedText>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>First name</ThemedText>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.background,
              borderColor: error ? '#E63946' : '#E0E0E0',
            },
          ]}
        >
          <IconUser size={20} color={colors.icon} strokeWidth={2} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Tu nombre"
            placeholderTextColor={colors.text + '80'}
            value={formData.name}
            onChangeText={(text) => {
              onDataChange({ name: text });
              if (error) setError('');
            }}
            autoCapitalize="words"
            autoCorrect={false}
            textContentType="givenName"
          />
        </View>
        {error && (
          <ThemedText style={styles.validationError}>{error}</ThemedText>
        )}
      </View>

      <View style={{ marginTop: 'auto', paddingBottom: 20 }}>
        <Button
          title="Next"
          onPress={handleNext}
          disabled={!formData.name.trim()}
        />
      </View>
    </View>
  );
};

export default NameStepComponent;
