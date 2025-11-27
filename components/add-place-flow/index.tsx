import AspectsStepComponent from '@/components/add-place-flow/steps/aspects-step';
import CustomizeStepComponent from '@/components/add-place-flow/steps/customize-step';
import MediaStepComponent from '@/components/add-place-flow/steps/media-step';
import PlaceSearchStepComponent from '@/components/add-place-flow/steps/place-search-step';
import RatingStepComponent from '@/components/add-place-flow/steps/rating-step';
import { styles } from '@/components/add-place-flow/styles';
import { SubmissionStatus } from '@/components/add-place-flow/submission-status';
import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useCreatePin } from '@/hooks/use-create-pin';
import { useKeyboard } from '@/hooks/use-keyboard';
import {
  AddPlaceFormData,
  useAddPlaceFormStore,
} from '@/stores/add-place-form-store';
import { useToast } from '@/utils/toast';
import { IconChevronLeft } from '@tabler/icons-react-native';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useState } from 'react';
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
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Step {
  id: number;
  title: string;
  component: React.ComponentType<StepComponentProps>;
}

interface StepComponentProps {
  formData: AddPlaceFormData;
  onDataChange: (data: Partial<AddPlaceFormData>) => void;
  onNext?: () => void;
  triggerValidation?: number;
}

// Step 1: Place Search
const PlaceSearchStep: React.FC<StepComponentProps> = ({
  formData,
  onDataChange,
  onNext,
}) => {
  return (
    <PlaceSearchStepComponent
      formData={formData}
      onDataChange={onDataChange}
      onNext={onNext}
    />
  );
};

// Step 2: Customize (Name, Description, Color & Icon)
const CustomizeStep: React.FC<StepComponentProps> = ({
  formData,
  onDataChange,
  onNext,
}) => {
  return (
    <CustomizeStepComponent
      formData={formData}
      onDataChange={onDataChange}
      onNext={onNext}
    />
  );
};

// Step 3: Media (Photos)
const MediaStep: React.FC<StepComponentProps> = ({
  formData,
  onDataChange,
}) => {
  return <MediaStepComponent formData={formData} onDataChange={onDataChange} />;
};

// Step 4: Aspects
const AspectsStep: React.FC<StepComponentProps> = ({
  formData,
  onDataChange,
}) => {
  return (
    <AspectsStepComponent formData={formData} onDataChange={onDataChange} />
  );
};

// Step 5: Rating
const RatingStep: React.FC<StepComponentProps> = ({
  formData,
  onDataChange,
}) => {
  return (
    <RatingStepComponent formData={formData} onDataChange={onDataChange} />
  );
};

const STEPS: Step[] = [
  { id: 1, title: '', component: PlaceSearchStep },
  { id: 2, title: '', component: CustomizeStep },
  // { id: 3, title: '', component: MediaStep },
  { id: 4, title: '', component: AspectsStep },
  { id: 5, title: '', component: RatingStep },
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
  const lineProgress = useSharedValue(isCompleted ? 1 : 0);

  useEffect(() => {
    lineProgress.value = withSpring(isCompleted ? 1 : 0, {
      damping: 15,
      stiffness: 100,
    });
  }, [isCompleted, lineProgress]);

  const lineStyle = useAnimatedStyle(() => {
    return {
      width: `${lineProgress.value * 100}%`,
    };
  });

  return (
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
            <ThemedText style={[styles.stepIndicatorText, { color: 'white' }]}>
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
            <Animated.View style={[styles.stepIndicatorLineFill, lineStyle]} />
          </View>
        )}
      </View>
    </View>
  );
};

interface AddPlaceFlowProps {
  onComplete?: (data: AddPlaceFormData) => void;
  onCancel?: () => void;
}

export default function AddPlaceFlow({
  onComplete,
  onCancel,
}: AddPlaceFlowProps) {
  const insets = useSafeAreaInsets();
  const colors = Colors['light'];
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    'success' | 'error' | null
  >(null);

  const createPinMutation = useCreatePin();
  const { showToast } = useToast();
  // Inside the component:
  const formData = useAddPlaceFormStore((state) => state.formData);
  const updateFormData = useAddPlaceFormStore((state) => state.updateFormData);
  const { keyboardHeight } = useKeyboard();

  // Replace handleDataChange:
  const handleDataChange = useCallback(
    (data: Partial<AddPlaceFormData>) => {
      updateFormData(data);
    },
    [updateFormData]
  );

  const goToStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex < 0 || stepIndex >= STEPS.length) return;

      // Determine direction
      const newDirection = stepIndex > currentStep ? 'forward' : 'backward';
      setDirection(newDirection);
      setCurrentStep(stepIndex);
    },
    [currentStep]
  );

  const handleSubmit = useCallback(async () => {
    console.log('🟢SUBMITTING PIN DATA', JSON.stringify(formData, null, 2));
    setIsSubmitting(true);
    setSubmissionStatus(null);

    try {
      // Send form data directly to the server
      const response = await createPinMutation.mutateAsync(formData);

      console.log('🟢🟢🟢🟢🟢🟢PIN CREATED', response);

      if (response.id) {
        setSubmissionStatus('success');
        setTimeout(() => {
          onComplete?.(formData);
        }, 1500);
      }
      setIsSubmitting(false);
    } catch (error) {
      console.error('🛑Submission error:', error);
      showToast('Error al crear el pin', 'error');
      setSubmissionStatus('error');
      setIsSubmitting(false);
      // Reset after showing error
      setTimeout(() => {
        setSubmissionStatus(null);
      }, 2000);
    }
  }, [formData, onComplete, createPinMutation, showToast]);

  const handleNext = useCallback(() => {
    // Validate customize step (step index 1) - check if name is filled
    if (currentStep === 1) {
      const placeName = formData.placeData?.name?.trim() || '';
      if (!placeName) {
        showToast('Dale un nombre a tu pin', 'info');
        return;
      }
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (currentStep < STEPS.length - 1) {
      goToStep(currentStep + 1);
    } else {
      // Last step - submit
      handleSubmit();
    }
  }, [currentStep, formData, goToStep, handleSubmit, showToast]);

  const resetFormData = useAddPlaceFormStore((state) => state.resetFormData);
  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (currentStep > 0) {
      goToStep(currentStep - 1);
    } else {
      onCancel?.();
      resetFormData();
    }
  }, [currentStep, goToStep, onCancel, resetFormData]);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === STEPS.length - 1;
  const canProceed =
    currentStep === 0
      ? !!formData.placeData && formData.placeData?.name?.trim().length > 0
      : isLastStep
        ? (formData.placeData?.name?.trim().length || 0) > 0
        : true;

  const CurrentStepComponent = STEPS[currentStep].component;
  const keyboardAnimationDuration = 150;
  // Animate footer padding based on keyboard visibility
  const footerPaddingTop = useSharedValue(16);
  const footerPaddingBottom = useSharedValue(Math.max(insets.bottom, 20));

  // Replace the useEffect with this:
  useEffect(() => {
    // Use keyboardWillShow/WillHide events for iOS (they fire during animation)
    // The keyboard height will change smoothly as the keyboard animates
    if (keyboardHeight > 0) {
      footerPaddingTop.value = withTiming(0, {
        duration: keyboardAnimationDuration, // Match iOS keyboard animation duration
      });
      footerPaddingBottom.value = withTiming(0, {
        duration: keyboardAnimationDuration,
      });
    } else {
      footerPaddingTop.value = withTiming(16, {
        duration: keyboardAnimationDuration,
      });
      footerPaddingBottom.value = withTiming(Math.max(insets.bottom, 20), {
        duration: keyboardAnimationDuration,
      });
    }
  }, [keyboardHeight, insets.bottom, footerPaddingTop, footerPaddingBottom]);

  const footerAnimatedStyle = useAnimatedStyle(() => {
    return {
      paddingTop: footerPaddingTop.value,
      paddingBottom: footerPaddingBottom.value,
    };
  });

  if (isSubmitting || submissionStatus) {
    return (
      <ThemedView style={styles.container}>
        <SubmissionStatus
          isSubmitting={isSubmitting}
          isSuccess={submissionStatus === 'success'}
          isError={submissionStatus === 'error'}
        />
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
                position: 'relative', // Ensure it stays in flow
                width: '100%', // Take full width
                height: '100%', // Take full height
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
        <Animated.View
          style={[
            styles.footer,
            {
              backgroundColor: colors.background,
            },
            footerAnimatedStyle,
          ]}
        >
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            activeOpacity={0.7}
            onLongPress={onCancel}
          >
            <IconChevronLeft
              size={20}
              color={isFirstStep ? colors.icon : colors.tint}
            />
            <ThemedText
              style={[
                styles.backButtonText,
                isFirstStep && styles.backButtonTextDisabled,
              ]}
            >
              {isFirstStep ? 'Cancelar' : 'Atrás'}
            </ThemedText>
          </TouchableOpacity>

          {!isFirstStep ? (
            <Button
              variant="filled"
              title={isLastStep ? 'Guardar' : 'Siguiente'}
              onPress={handleNext}
              disabled={!canProceed}
              style={styles.nextButton}
            />
          ) : null}
        </Animated.View>
      </KeyboardAvoidingView>
    </ThemedView>
    // </SafeAreaView>
  );
}
