import { StyleSheet, View } from 'react-native';

import { useCallback, useState } from 'react';

import { useAnimatedReaction, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { Dots } from './dots/index';
import { StepButtons } from './step-buttons/index';

const StepComponent = () => {
  const activeIndex = useSharedValue(0);
  const [isLastStep, setIsLastStep] = useState(false);

  const rightLabel = isLastStep ? 'Finalizar' : 'Siguiente';

  const increaseActiveIndex = useCallback(() => {
    activeIndex.set((activeIndex.get() + 1) % 5);
  }, [activeIndex]);

  const decreaseActiveIndex = useCallback(() => {
    activeIndex.set(Math.max(0, activeIndex.get() - 1));
  }, [activeIndex]);

  useAnimatedReaction(
    () => activeIndex.get(),
    (index) => {
      scheduleOnRN(setIsLastStep, index === 4);
    }
  );

  return (
    <View style={styles.container}>
      <Dots activeIndex={activeIndex} count={5} dotSize={8} />
      <StepButtons
        activeIndex={activeIndex}
        rightLabel={rightLabel}
        backButtonLabel="Atrás"
        onBack={decreaseActiveIndex}
        onContinue={increaseActiveIndex}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 64,
  },
});

export { StepComponent };
