import React from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import * as Haptics from 'expo-haptics';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { Paginator } from '../paginator';

import type { StyleProp, ViewStyle } from 'react-native';

type StackedCarouselProps<T = unknown> = {
  onImagePress: (index: number) => void;
  style?: StyleProp<ViewStyle>;
  data: T[];
  renderCard: (item: T, index: number) => React.ReactNode;
  cardWidth?: number; // If not provided, will use 100% of container width
  cardHeight?: number;
  minHeight?: number; // Minimum height for the container
  stackOffset?: number;
  showPaginator?: boolean;
  paginatorVisibleDots?: number;
  paginatorDotSize?: number;
  paginatorSpacing?: number;
  paginatorBackground?: React.ReactNode;
};

const AnimatedCard = ({
  index,
  onImagePress,
  scrollX,
  cardWidth,
  cardHeight,
  totalCards,
  children,
}: {
  index: number;
  onImagePress: (index: number) => void;
  scrollX: SharedValue<number>;
  cardWidth: number;
  cardHeight: number;
  totalCards: number;
  children: React.ReactNode;
}) => {
  const extendedInputRange = [
    (index - 2) * cardWidth,
    (index - 1) * cardWidth,
    index * cardWidth,
    (index + 1) * cardWidth,
    (index + 2) * cardWidth,
  ];

  const animatedStyle = useAnimatedStyle(() => {
    // Scale animation - your organic scaling
    const scale = interpolate(
      scrollX.value,
      extendedInputRange,
      [0.7, 0.8, 1, 1.5, 1.5],
      Extrapolation.CLAMP
    );

    // Organic fade to the top - cards move upward and fade
    const translateY = interpolate(
      scrollX.value,
      extendedInputRange,
      [65, 35, 0, -100, -100],
      Extrapolation.CLAMP
    );

    // Organic fade - cards fade as they move up
    const opacity = interpolate(
      scrollX.value,
      extendedInputRange,
      [0.2, 0.8, 1, -1, -2],
      Extrapolation.EXTEND
    );

    return {
      transform: [{ translateY: translateY }, { scale: scale }],
      opacity,
    };
  });

  const rRotateStyle = useAnimatedStyle(() => {
    const rotateX = interpolate(
      scrollX.value,
      extendedInputRange,
      [45, 30, 0, 0, 0],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { perspective: 600 },
        { rotateX: `${Math.floor(rotateX)}deg` },
      ],
    };
  });

  return (
    <Animated.View
      collapsable={false}
      style={[
        styles.cardContainer,
        {
          pointerEvents: 'none',
          width: cardWidth,
          height: cardHeight,
          zIndex: totalCards * 1000 - index,
        },
        animatedStyle,
      ]}
    >
      <Animated.View
        style={[
          {
            flex: 1,
          },
          rRotateStyle,
        ]}
      >
        <View style={styles.cardShadow} collapsable={false}>
          {children}
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export const StackedCarousel = <T,>({
  onImagePress,
  style,
  data,
  renderCard,
  cardWidth,
  cardHeight = 180,
  minHeight,
  stackOffset = 8,
  showPaginator = true,
  paginatorVisibleDots = 5,
  paginatorDotSize = 10,
  paginatorSpacing = 10,
}: StackedCarouselProps<T>) => {
  const { width: screenWidth } = useWindowDimensions();
  const [containerWidth, setContainerWidth] = React.useState(screenWidth);

  // Use 100% width if cardWidth is not provided, otherwise use provided width
  const actualCardWidth = cardWidth ?? containerWidth;

  // Calculate container height: use minHeight if provided, otherwise cardHeight + stackOffset padding
  const containerHeight = minHeight
    ? Math.max(minHeight, cardHeight + stackOffset * 8)
    : cardHeight + stackOffset * 8;

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  // Shared value for scroll position
  const scrollX = useSharedValue(0);

  // Scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  // Calculate current page index for paginator
  const currentPageIndex = useDerivedValue(() => {
    return scrollX.value / actualCardWidth;
  });

  useAnimatedReaction(
    () => Math.round(currentPageIndex.value),
    (curr, prev) => {
      if (curr !== prev && prev !== null) {
        scheduleOnRN(Haptics.selectionAsync);
      }
    }
  );

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.container,
        {
          width: '100%',
          minHeight: containerHeight,
        },
        style,
      ]}
    >
      {/* Render animated cards */}
      {data.map((item, index) => (
        <AnimatedCard
          key={index}
          index={index}
          onImagePress={() => onImagePress(index)}
          scrollX={scrollX}
          cardWidth={actualCardWidth}
          cardHeight={cardHeight}
          totalCards={data.length}
        >
          {renderCard(item, index)}
        </AnimatedCard>
      ))}

      {/* Invisible horizontal scroll view positioned over the cards */}
      <Animated.FlatList
        data={data}
        renderItem={({ index: itemIndex }) => (
          <Pressable
            onPress={() => onImagePress(itemIndex)}
            style={{
              width: actualCardWidth,
              height: cardHeight,
            }}
          />
        )}
        snapToInterval={actualCardWidth}
        horizontal
        disableIntervalMomentum
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        decelerationRate="fast"
        style={{
          position: 'absolute',
          width: containerWidth,
          height: containerHeight,
          zIndex: 1000,
        }}
        contentContainerStyle={{
          paddingLeft: (containerWidth - actualCardWidth) / 2,
          paddingTop: stackOffset * 3,
        }}
      />

      {/* Paginator */}
      {showPaginator && (
        <>
          <View
            style={{
              width: containerWidth,
              position: 'absolute',
              // bottom: 0,
              top: cardHeight,
              bottom: 0,
            }}
          >
            <Paginator
              pagesAmount={data.length}
              currentPageIndex={currentPageIndex}
              visibleDots={paginatorVisibleDots}
              dotSize={paginatorDotSize}
              spacing={paginatorSpacing}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position: 'absolute',
  },
  cardShadow: {
    backgroundColor: 'white',
    borderCurve: 'continuous',
    borderRadius: 25,
    boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.05)',
    flex: 1,
    overflow: 'hidden',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
});
