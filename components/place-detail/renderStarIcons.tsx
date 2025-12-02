import { IconStar } from '@tabler/icons-react-native';
import { StyleSheet, View } from 'react-native';

export const renderStarIcons = ({
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
  return stars;
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
