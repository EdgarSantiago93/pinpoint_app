import { AnimatedCount } from '@/components/animated-count/animated-count';
import { ThemedText } from '@/components/themed-text';
import { Colors, nunito600semibold } from '@/constants/theme';
import { AddPlaceFormData } from '@/stores/add-place-form-store';
import { IconStar } from '@tabler/icons-react-native';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  maxStars?: number;
  starSize?: number;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  maxStars = 5,
  starSize = 48,
}) => {
  const starsRowRef = useRef<View>(null);
  const starsRowWidth = useSharedValue(0);
  const previousRatingRef = useRef<number>(rating);

  // Sync the ref when rating prop changes externally
  useEffect(() => {
    previousRatingRef.current = rating;
  }, [rating]);

  const calculateRatingFromX = (x: number, width: number): number => {
    'worklet';
    if (width === 0) return 0;

    // Each star is starSize (56px) with 8px gap between them
    const starWidth = starSize;
    const gap = 8;
    const totalWidth = starWidth * maxStars + gap * (maxStars - 1);

    // Normalize x to the stars row width
    const normalizedX = Math.max(0, Math.min(totalWidth, x));

    // Calculate which star and position
    const starIndex = Math.floor(normalizedX / (starWidth + gap));
    const positionInStar = (normalizedX % (starWidth + gap)) / starWidth;

    // Determine if it's a half star or full star
    const isHalf = positionInStar < 0.5 && positionInStar >= 0;
    const baseRating = Math.min(starIndex, maxStars - 1) + (isHalf ? 0.5 : 1);

    // Clamp between 0 and maxStars
    return Math.max(0, Math.min(maxStars, baseRating));
  };

  const triggerHapticIfChanged = (newRating: number) => {
    // Round to nearest 0.5 to get discrete star/half-star values
    const discreteRating = Math.round(newRating * 2) / 2;
    const previousDiscreteRating =
      Math.round(previousRatingRef.current * 2) / 2;

    // Only trigger haptic if the discrete rating value changed
    if (discreteRating !== previousDiscreteRating) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      previousRatingRef.current = newRating;
    }
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newRating = calculateRatingFromX(event.x, starsRowWidth.value);
      runOnJS(triggerHapticIfChanged)(newRating);
      runOnJS(onRatingChange)(newRating);
    })
    .onEnd(() => {
      // Rating is already set in onUpdate
    });

  const tapGesture = Gesture.Tap().onEnd((event) => {
    const newRating = calculateRatingFromX(event.x, starsRowWidth.value);
    runOnJS(triggerHapticIfChanged)(newRating);
    runOnJS(onRatingChange)(newRating);
  });

  const composedGesture = Gesture.Simultaneous(panGesture, tapGesture);

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const isFull = rating >= starValue;
    const isHalf = rating >= starValue - 0.5 && rating < starValue;

    return (
      <View key={index} style={styles.starContainer}>
        {isFull ? (
          <IconStar
            size={starSize}
            color={'rgb(252, 202, 83)'}
            fill={'rgb(252, 202, 83)'}
          />
        ) : isHalf ? (
          <View style={styles.halfStarContainer}>
            <IconStar
              size={starSize}
              color={'rgb(252, 202, 83)'}
              style={styles.halfStarEmpty}
            />
            <View style={styles.halfStarFilled}>
              <IconStar
                size={starSize}
                color={'rgb(252, 202, 83)'}
                fill={'rgb(252, 202, 83)'}
              />
            </View>
          </View>
        ) : (
          <IconStar size={starSize} color={'rgb(252, 202, 83)'} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composedGesture}>
        <View
          ref={starsRowRef}
          onLayout={(event) => {
            starsRowWidth.value = event.nativeEvent.layout.width;
          }}
          style={styles.starsRow}
        >
          {Array.from({ length: maxStars }, (_, i) => renderStar(i))}
        </View>
      </GestureDetector>
    </View>
  );
};

const RatingStepComponent = ({
  formData,
  onDataChange,
}: {
  formData: AddPlaceFormData;
  onDataChange: (data: Partial<AddPlaceFormData>) => void;
}) => {
  const rating = formData.rating || 0;

  const handleRatingChange = (newRating: number) => {
    onDataChange({ rating: newRating });
  };

  return (
    <View style={styles.stepContent}>
      <View style={styles.centerContainer}>
        <ThemedText type="title-serif" style={styles.stepTitle}>
          Califica tu experiencia
        </ThemedText>
        <ThemedText style={styles.stepDescription}>
          ¿Cómo calificarías tu visita a este lugar?
        </ThemedText>
        <View style={styles.ratingContainer}>
          <StarRating
            rating={rating}
            onRatingChange={handleRatingChange}
            maxStars={5}
            starSize={56}
          />
        </View>

        <View style={{ position: 'relative' }}>
          <AnimatedCount number={rating.toFixed(1)} />
        </View>
        <ThemedText style={styles.ratingText}>estrellas</ThemedText>
      </View>
    </View>
  );
};

export default RatingStepComponent;

const styles = StyleSheet.create({
  stepContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  centerContainer: {
    alignItems: 'center',
    width: '100%',
  },
  stepTitle: {
    fontSize: 32,
    marginBottom: 12,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 18,
    color: '#687076',
    marginBottom: 48,
    textAlign: 'center',
  },
  ratingContainer: {
    marginBottom: 24,
    width: '100%',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 20,
  },
  starContainer: {
    position: 'relative',
  },
  halfStarContainer: {
    position: 'relative',
    width: 56,
    height: 56,
  },
  halfStarEmpty: {
    position: 'absolute',
  },
  halfStarFilled: {
    position: 'absolute',
    width: '50%',
    overflow: 'hidden',
    left: 0,
  },
  ratingText: {
    fontSize: 20,
    color: Colors['light'].text,
    fontWeight: '600',
    fontFamily: nunito600semibold,
  },
});
