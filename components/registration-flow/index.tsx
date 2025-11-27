import {
  RegistrationFormData,
  useRegistrationFormStore,
} from '@/stores/registration-form-store';
import { IconChevronLeft } from '@tabler/icons-react-native';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
} from 'react-native-reanimated';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import CodeVerificationStepComponent from '@/components/registration-flow/steps/code-verification-step';
import EmailStepComponent from '@/components/registration-flow/steps/email-step';
import NameStepComponent from '@/components/registration-flow/steps/name-step';
import PasswordStepComponent from '@/components/registration-flow/steps/password-step';
import SuccessStepComponent from '@/components/registration-flow/steps/success-step';
import UsernameStepComponent from '@/components/registration-flow/steps/username-step';
import { styles } from '@/components/registration-flow/styles';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';

interface Step {
  id: number;
  title: string;
  component: React.ComponentType<StepComponentProps>;
}

interface StepComponentProps {
  formData: RegistrationFormData;
  onDataChange: (data: Partial<RegistrationFormData>) => void;
  onNext?: () => void;
  onComplete?: () => void;
}

// Step 0: Email
const EmailStep: React.FC<StepComponentProps> = ({
  formData,
  onDataChange,
  onNext,
}) => {
  return (
    <EmailStepComponent
      formData={formData}
      onDataChange={onDataChange}
      onNext={onNext}
    />
  );
};

// Step 1: Code Verification
const CodeVerificationStep: React.FC<StepComponentProps> = ({
  formData,
  onDataChange,
  onNext,
}) => {
  return (
    <CodeVerificationStepComponent
      formData={formData}
      onDataChange={onDataChange}
      onNext={onNext}
    />
  );
};

// Step 2: Name
const NameStep: React.FC<StepComponentProps> = ({
  formData,
  onDataChange,
  onNext,
}) => {
  return (
    <NameStepComponent
      formData={formData}
      onDataChange={onDataChange}
      onNext={onNext}
    />
  );
};

// Step 3: Username
const UsernameStep: React.FC<StepComponentProps> = ({
  formData,
  onDataChange,
  onNext,
}) => {
  return (
    <UsernameStepComponent
      formData={formData}
      onDataChange={onDataChange}
      onNext={onNext}
    />
  );
};

// Step 4: Password
const PasswordStep: React.FC<StepComponentProps> = ({
  formData,
  onDataChange,
  onNext,
}) => {
  return (
    <PasswordStepComponent
      formData={formData}
      onDataChange={onDataChange}
      onNext={onNext}
    />
  );
};

// Step 5: Success
const SuccessStep: React.FC<StepComponentProps> = ({
  formData,
  onComplete,
}) => {
  return <SuccessStepComponent formData={formData} onComplete={onComplete} />;
};

const STEPS: Step[] = [
  { id: 0, title: 'Email', component: EmailStep },
  { id: 1, title: 'Code', component: CodeVerificationStep },
  { id: 2, title: 'Name', component: NameStep },
  { id: 3, title: 'Username', component: UsernameStep },
  { id: 4, title: 'Password', component: PasswordStep },
  { id: 5, title: 'Success', component: SuccessStep },
];

interface StepIndicatorProps {
  step: Step;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  isLast: boolean;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  step,
  index,
  isActive,
  isCompleted,
  isLast,
}) => {
  return (
    <SafeAreaView style={styles.stepIndicatorContainer}>
      <View style={styles.stepIndicatorContainer}>
        <View style={styles.stepIndicatorWrapper}>
          <View
            style={[
              styles.stepIndicator,
              isActive && styles.stepIndicatorActive,
              isCompleted && styles.stepIndicatorCompleted,
            ]}
          >
            {isCompleted ? (
              <ThemedText
                style={[styles.stepIndicatorText, { color: 'white' }]}
              >
                ✓
              </ThemedText>
            ) : (
              <ThemedText style={styles.stepIndicatorText}>
                {index + 1}
              </ThemedText>
            )}
          </View>
          {!isLast && (
            <View style={styles.stepIndicatorLineContainer}>
              <View style={styles.stepIndicatorLineBackground} />
              <View
                style={[
                  styles.stepIndicatorLineFill,
                  { width: isCompleted ? '100%' : '0%' },
                ]}
              />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

interface RegistrationFlowProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export default function RegistrationFlow({
  onComplete,
  onCancel,
}: RegistrationFlowProps) {
  const insets = useSafeAreaInsets();
  const colors = Colors['light'];
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const formData = useRegistrationFormStore((state) => state.formData);
  const updateFormData = useRegistrationFormStore(
    (state) => state.updateFormData
  );

  const handleDataChange = useCallback(
    (data: Partial<RegistrationFormData>) => {
      updateFormData(data);
    },
    [updateFormData]
  );

  const goToStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex < 0 || stepIndex >= STEPS.length) return;

      const newDirection = stepIndex > currentStep ? 'forward' : 'backward';
      setDirection(newDirection);
      setCurrentStep(stepIndex);
    },
    [currentStep]
  );

  const handleNext = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStep < STEPS.length - 1) {
      goToStep(currentStep + 1);
    }
  }, [currentStep, goToStep]);

  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    } else {
      onCancel?.();
    }
  }, [currentStep, goToStep, onCancel]);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === STEPS.length - 1;
  const CurrentStepComponent = STEPS[currentStep].component;

  // Don't show navigation on success step
  if (isLastStep) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.contentContainer}>
          <CurrentStepComponent
            formData={formData}
            onDataChange={handleDataChange}
            onComplete={onComplete}
          />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        {/* Step Indicators */}
        <View style={styles.stepIndicators}>
          {STEPS.map((step, index) => (
            <StepIndicator
              key={step.id}
              step={step}
              index={index}
              isActive={index === currentStep}
              isCompleted={index < currentStep}
              isLast={index === STEPS.length - 1}
            />
          ))}
        </View>

        {/* Step Content */}
        <View style={styles.contentContainer}>
          <Animated.View
            key={currentStep}
            entering={
              direction === 'forward'
                ? FadeInDown.duration(300)
                : FadeInUp.duration(300)
            }
            exiting={
              direction === 'forward'
                ? FadeOutDown.duration(300)
                : FadeOutUp.duration(300)
            }
            style={[
              styles.stepWrapper,
              {
                position: 'relative',
                width: '100%',
                height: '100%',
              },
            ]}
          >
            <CurrentStepComponent
              formData={formData}
              onDataChange={handleDataChange}
              onNext={handleNext}
            />
          </Animated.View>
        </View>

        {/* Navigation Footer */}
        <View
          style={[
            styles.footer,
            {
              paddingBottom: Math.max(insets.bottom, 20),
            },
          ]}
        >
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            // disabled={isFirstStep}
          >
            <IconChevronLeft
              size={20}
              color={isFirstStep ? colors.icon + '80' : colors.tint}
              strokeWidth={2}
            />
            <ThemedText
              style={[
                styles.backButtonText,
                isFirstStep && styles.backButtonTextDisabled,
              ]}
            >
              Atrás
            </ThemedText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
