import { Button } from '@/components/button';
import RegistrationFlow from '@/components/registration-flow';
import { ThemedText } from '@/components/themed-text';
import { FlexView } from '@/components/ui/flex-view';
import { Colors, nunito600semibold } from '@/constants/theme';
import { useAuthStore } from '@/stores/auth-store';
import { useRegistrationFormStore } from '@/stores/registration-form-store';
import { validateEmail as validateEmailApi } from '@/utils/auth-api';
import { useToast } from '@/utils/toast';
import { IconEye, IconEyeOff } from '@tabler/icons-react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showRegistrationFlow, setShowRegistrationFlow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const resetFormData = useRegistrationFormStore(
    (state) => state.resetFormData
  );
  const { showToast } = useToast();
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  // Reset registration form when switching away from register mode
  useEffect(() => {
    if (!isRegisterMode && showRegistrationFlow) {
      setShowRegistrationFlow(false);
      resetFormData();
    }
  }, [isRegisterMode, showRegistrationFlow, resetFormData]);

  // When user toggles to register mode, show the onboarding flow
  const handleRegisterToggle = () => {
    setIsRegisterMode(true);
    setShowRegistrationFlow(true);
  };

  const handleRegistrationCancel = () => {
    setShowRegistrationFlow(false);
    setIsRegisterMode(false);
    resetFormData();
  };

  const handleRegistrationComplete = () => {
    // Registration is handled in the success step
    // This is just for cleanup if needed
    resetFormData();
  };

  const handleLogin = async () => {
    try {
      if (!isEmailVerified) {
        return await validateEmail(email);
      }
      setIsLoading(true);
      await login(email.trim(), password);
      showToast('Bienvenid@ de nuevo!', 'success');
      router.replace('/pages' as any);
    } catch (error: any) {
      console.log('error', error);
      showToast('Error al iniciar sesión', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Show registration flow if user is in register mode
  if (showRegistrationFlow) {
    return (
      <RegistrationFlow
        onComplete={handleRegistrationComplete}
        onCancel={handleRegistrationCancel}
      />
    );
  }

  const validateEmail = async (email: string) => {
    try {
      if (!email.trim()) {
        showToast('Por favor escribe tu email', 'info');
        emailInputRef.current?.focus();
        setIsEmailVerified(false);
        return;
      }

      setIsLoading(true);
      // Use the auth-api utility
      const data = await validateEmailApi(email);

      const { ok, action } = data;
      if (action === 'user_inactive_or_deleted') {
        showToast('Tu cuenta ha sido desactivada o eliminada', 'error');
        setIsEmailVerified(false);
        return;
      }
      if (action === 'email_not_found') {
        showToast(
          'Email no encontrado, por favor verificalo o crea una cuenta',
          'error'
        );
        setIsEmailVerified(false);
        return;
      }
      if (ok) {
        setShowPasswordInput(true);
        setIsEmailVerified(true);
        setTimeout(() => {
          passwordInputRef.current?.focus();
        }, 250);
      } else {
        showToast('Ocurrió un error, por favor intenta nuevamente', 'error');
        setIsEmailVerified(false);
        return;
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: 'rgb(251, 245, 239)' }]}
    >
      <TouchableOpacity
        onPress={() => {
          Keyboard.dismiss();
        }}
        activeOpacity={1}
        style={styles.keyboardView}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
          <View style={styles.content}>
            <FlexView
              animated
              centerH
              centerV
              style={{ marginBottom: 32 }}
              entering={FadeInDown}
            >
              <Image
                source={require('@/assets/images/logo_shadow.png')}
                style={{ width: 65, height: 65 }}
                contentFit="contain"
              />
              <ThemedText type="title-serif" style={{ fontSize: 42 }}>
                Pinpoint
              </ThemedText>
            </FlexView>

            <Animated.View
              layout={LinearTransition.springify(250).damping(15).stiffness(90)}
            >
              <Animated.View
                style={styles.inputGroup}
                entering={FadeIn}
                exiting={FadeOut}
              >
                <ThemedText type="defaultSemiBold" style={styles.label}>
                  Email
                </ThemedText>
                <View
                  style={{
                    ...styles.inputContainer,
                    height: 56,
                    backgroundColor: isLoading ? 'rgb(231, 221, 212)' : 'white',
                  }}
                >
                  <TextInput
                    ref={emailInputRef}
                    style={styles.input}
                    placeholderTextColor={Colors['light'].icon}
                    placeholder="tu@email.com"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    editable={!isLoading}
                    clearButtonMode="always"
                  />
                </View>
              </Animated.View>

              {showPasswordInput ? (
                <Animated.View
                  style={styles.inputGroup}
                  entering={FadeInDown.delay(100).duration(150).springify()}
                  exiting={FadeOut}
                >
                  <ThemedText type="defaultSemiBold" style={styles.label}>
                    Contraseña
                  </ThemedText>
                  <View
                    style={{
                      ...styles.inputContainer,
                      height: 56,
                      backgroundColor: isLoading
                        ? 'rgb(231, 221, 212)'
                        : 'white',
                    }}
                  >
                    <TextInput
                      ref={passwordInputRef}
                      style={styles.input}
                      placeholder="••••••••"
                      placeholderTextColor={Colors['light'].icon}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      textContentType="password"
                      editable={!isLoading}
                      clearButtonMode="never"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <IconEyeOff
                          size={20}
                          color={Colors['light'].icon + 90}
                          strokeWidth={2.5}
                        />
                      ) : (
                        <IconEye
                          size={20}
                          color={Colors['light'].icon + 90}
                          strokeWidth={2.5}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              ) : null}

              <Button
                title="Iniciar sesión"
                onPress={handleLogin}
                loading={isLoading}
                disabled={isLoading}
                style={styles.loginButton}
              />
              <View style={{ marginTop: 16 }}>
                <Button
                  title="Crear cuenta"
                  variant="text"
                  style={styles.loginButton}
                  onPress={handleRegisterToggle}
                />
              </View>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'center',
  },

  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  eyeButtonText: {
    fontSize: 14,
    color: '#912121',
  },
  loginButton: {
    marginTop: 8,
    width: '100%',
  },
  ////

  inputGroup: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
    fontSize: 17,
  },

  input: {
    flex: 1,
    color: Colors.light.text,
    padding: 0,
    fontSize: 16,
    fontFamily: nunito600semibold,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    borderRadius: 8,
    paddingHorizontal: 15.5,
    paddingVertical: 12,
    gap: 12,
    padding: 0,
    margin: 0,
    borderWidth: 1.5,
    color: Colors.light.text,
    borderColor: Colors.light.tint + 90,
  },
});
