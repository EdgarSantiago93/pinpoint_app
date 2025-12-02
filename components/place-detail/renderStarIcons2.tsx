import { IconStar } from '@tabler/icons-react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FlipInXUp } from 'react-native-reanimated';

export const renderStarIcons2 = ({
  rating,
  starSize = 16,
}: {
  rating: number;
  starSize?: number;
}) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <IconStar
          key={i}
          size={starSize}
          color="#F4C430"
          fill="#F4C430"
          style={styles.star}
        />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <View key={i} style={styles.halfStarContainer}>
          <IconStar
            size={starSize}
            color="#F4C430"
            style={styles.halfStarEmpty}
          />
          <View style={styles.halfStarFilled}>
            <IconStar size={starSize} color="#F4C430" fill="#F4C430" />
          </View>
        </View>
      );
    } else {
      stars.push(
        <IconStar
          key={i}
          size={starSize}
          color="#E0E0E0"
          fill="transparent"
          style={styles.star}
        />
      );
    }
  }

  return (
    <>
      <EmptyStar starSize={starSize} delay={0} />
      <EmptyStar starSize={starSize} delay={75} />
      <EmptyStar starSize={starSize} delay={150} />
      <EmptyStar starSize={starSize} delay={225} />
      <EmptyStar starSize={starSize} delay={300} />
      <View
        style={{ flexDirection: 'row', position: 'absolute', zIndex: 1000 }}
      >
        {stars.map((star, index) => (
          <Animated.View
            key={index}
            entering={FadeIn.delay(400 + index * 75).duration(200)}
          >
            {star}
          </Animated.View>
        ))}
      </View>
    </>
  );
};

const EmptyStar = ({
  starSize,
  delay,
}: {
  starSize: number;
  delay: number;
}) => {
  return (
    <Animated.View entering={FlipInXUp.delay(delay).duration(200)}>
      <IconStar
        size={starSize}
        color="#E0E0E0"
        fill="transparent"
        style={styles.star}
      />
    </Animated.View>
  );
};

export const SkeletonStar = ({ starSize }: { starSize: number }) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <IconStar size={starSize} color="#E0E0E0" fill="transparent" />
      <IconStar size={starSize} color="#E0E0E0" fill="transparent" />
      <IconStar size={starSize} color="#E0E0E0" fill="transparent" />
      <IconStar size={starSize} color="#E0E0E0" fill="transparent" />
      <IconStar size={starSize} color="#E0E0E0" fill="transparent" />
    </View>
  );
};
const styles = StyleSheet.create({
  star: {
    marginRight: 2,
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
