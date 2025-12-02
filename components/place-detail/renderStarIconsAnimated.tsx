import { IconStar } from '@tabler/icons-react-native';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

// Individual animated star component
const AnimatedStarItem = ({
  index,
  rating,
  starSize,
  animationDelay,
}: {
  index: number;
  rating: number;
  starSize: number;
  animationDelay: number;
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const fillProgress = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const delay = index * animationDelay;
      const fillTimer = setTimeout(() => {
        if (index < fullStars) {
          // Full star
          fillProgress.value = withTiming(1, { duration: 400 });
        } else if (index === fullStars && hasHalfStar) {
          // Half star
          fillProgress.value = withTiming(0.5, { duration: 400 });
        } else {
          // Empty star stays at 0
          fillProgress.value = 0;
        }
      }, delay);

      return () => clearTimeout(fillTimer);
    }, 100);

    return () => clearTimeout(timer);
  }, [rating, index, fullStars, hasHalfStar, animationDelay, fillProgress]);

  if (index < fullStars) {
    // Full star - will animate from empty to filled
    return <AnimatedStar starSize={starSize} fillProgress={fillProgress} />;
  } else if (index === fullStars && hasHalfStar) {
    // Half star - will animate from empty to half filled
    return <AnimatedHalfStar starSize={starSize} fillProgress={fillProgress} />;
  } else {
    // Empty star - stays empty
    return (
      <IconStar
        size={starSize}
        color="#E0E0E0"
        fill="transparent"
        style={styles.star}
      />
    );
  }
};

export const renderStarIconsAnimated = ({
  rating,
  starSize = 16,
  animationDelay = 200,
}: {
  rating: number;
  starSize?: number;
  animationDelay?: number;
}) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <AnimatedStarItem
        key={i}
        index={i}
        rating={rating}
        starSize={starSize}
        animationDelay={animationDelay}
      />
    );
  }
  return stars;
};

// Animated full star component
const AnimatedStar = ({
  starSize,
  fillProgress,
}: {
  starSize: number;
  fillProgress: SharedValue<number>;
}) => {
  const fillAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fillProgress.value,
    };
  });

  return (
    <View style={styles.starContainer}>
      {/* Empty star background */}
      {/* <IconStar
        size={starSize}
        color="#E0E0E0"
        fill="transparent"
        style={[styles.star, styles.starBackground]}
      /> */}
      {/* Filled star overlay */}
      <Animated.View style={[styles.starOverlay, fillAnimatedStyle]}>
        <IconStar
          size={starSize}
          color="#F4C430"
          fill="#F4C430"
          style={styles.star}
        />
      </Animated.View>
    </View>
  );
};

// Animated half star component
const AnimatedHalfStar = ({
  starSize,
  fillProgress,
}: {
  starSize: number;
  fillProgress: SharedValue<number>;
}) => {
  const fillAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fillProgress.value,
    };
  });

  return (
    <View style={styles.halfStarContainer}>
      {/* Empty star background */}
      <IconStar
        size={starSize}
        color="#E0E0E0"
        fill="transparent"
        style={styles.halfStarEmpty}
      />
      {/* Half filled star overlay */}
      <Animated.View style={[styles.halfStarFilled, fillAnimatedStyle]}>
        <IconStar size={starSize} color="#F4C430" fill="#F4C430" />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 2,
  },
  starContainer: {
    position: 'relative',
    marginRight: 2,
  },
  starBackground: {
    position: 'absolute',
  },
  starOverlay: {
    position: 'absolute',
  },
  halfStarOverlay: {
    width: '50%',
    overflow: 'hidden',
  },
  halfStarContainer: {
    position: 'relative',
    width: 20,
    height: 20,
    marginRight: 2,
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
});
