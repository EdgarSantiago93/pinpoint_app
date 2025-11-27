import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/stores/auth-store';
import { RegistrationFormData } from '@/stores/registration-form-store';
import { IconCircleCheck } from '@tabler/icons-react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { styles } from '../styles';

const SuccessStepComponent = ({
  formData,
  onComplete,
}: {
  formData: RegistrationFormData;
  onComplete?: () => void;
}) => {
  const colors = Colors['light'];
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const [isRegistering, setIsRegistering] = useState(true);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const iconScale = useSharedValue(0);
  const iconOpacity = useSharedValue(0);
  const confettiOpacity = useSharedValue(0);

  useEffect(() => {
    // Call registration API
    const performRegistration = async () => {
      try {
        await register(
          formData.email.trim(),
          formData.username.trim(),
          formData.password,
          formData.name.trim() || undefined
        );

        setIsRegistering(false);
        setRegistrationComplete(true);

        // Animate success icon
        iconScale.value = withSpring(1, { damping: 10, stiffness: 100 });
        iconOpacity.value = withTiming(1, { duration: 500 });
        confettiOpacity.value = withTiming(1, { duration: 800 });

        Toast.show({
          type: 'success',
          text1: 'Registro exitoso',
          text2: 'Bienvenido a Pinpoint',
          visibilityTime: 2000,
          position: 'top',
        });
      } catch (error: any) {
        setIsRegistering(false);
        Toast.show({
          type: 'error',
          text1: 'Error al registrarse',
          text2: error.message || 'No se pudo crear la cuenta',
          visibilityTime: 4000,
          position: 'top',
        });
        // On error, could go back or show error state
      }
    };

    performRegistration();
  }, []);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
    opacity: iconOpacity.value,
  }));

  const confettiAnimatedStyle = useAnimatedStyle(() => ({
    opacity: confettiOpacity.value,
  }));

  const handleLetsGo = () => {
    router.replace('/pages' as any);
    onComplete?.();
  };

  if (isRegistering) {
    return (
      <View style={styles.successContainer}>
        <ThemedText type="title" style={styles.stepTitle}>
          Creating your account...
        </ThemedText>
      </View>
    );
  }

  if (!registrationComplete) {
    return (
      <View style={styles.successContainer}>
        <ThemedText type="title" style={styles.stepTitle}>
          Registration failed
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.successContainer}>
      {/* Confetti effect */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          },
          confettiAnimatedStyle,
        ]}
      >
        {/* Simple confetti representation */}
        {[...Array(20)].map((_, i) => {
          const angle = (i * 18) * (Math.PI / 180);
          const distance = 80;
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;
          const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFEAA7', '#DDA0DD'];
          return (
            <View
              key={i}
              style={{
                position: 'absolute',
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: colors[i % colors.length],
                transform: [{ translateX: x }, { translateY: y }],
              }}
            />
          );
        })}
      </Animated.View>

      {/* Success Icon */}
      <Animated.View style={iconAnimatedStyle}>
        <View style={styles.successIcon}>
          <IconCircleCheck size={64} color="#FFF" strokeWidth={3} />
        </View>
      </Animated.View>

      <ThemedText type="title" style={styles.successTitle}>
        You're All Set!
      </ThemedText>
      <ThemedText style={styles.successDescription}>
        Let's help guide you on your health journey.
      </ThemedText>

      <View style={{ width: '100%', marginTop: 32 }}>
        <Button title="Let's Go" onPress={handleLetsGo} />
      </View>
    </View>
  );
};

export default SuccessStepComponent;


