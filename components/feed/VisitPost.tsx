import FeedFooter from '@/components/feed/feedFooter';
import FeedTitle from '@/components/feed/feedTitle';
import { ThemedText } from '@/components/themed-text';
import { Colors, nunito400regular, nunito700bold } from '@/constants/theme';
import { IconPhoto } from '@tabler/icons-react-native';
import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { VisitPost } from './types';

interface VisitPostProps {
  post: VisitPost;
  onPress?: () => void;
  index?: number;
}

export function VisitPostComponent({ post, onPress, index = 0 }: VisitPostProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).duration(400).springify()}
      style={styles.container}
    >
      <FeedTitle post={post} onPress={onPress} />

      {/* Content */}
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.placeCard}
          onPress={onPress}
          activeOpacity={0.8}
        >
          {post.place.image ? (
            <Image
              source={{ uri: post.place.image }}
              style={styles.placeImage}
              contentFit="cover"
            />
          ) : (
            <View style={styles.placeImage}>
              <IconPhoto size={24} color={'rgb(255, 189, 123)'} />
            </View>
          )}
          <View style={styles.placeCardContent}>
            <ThemedText style={styles.placeCardName} numberOfLines={2}>
              {post.place.name}
            </ThemedText>

            <ThemedText style={styles.placeCardLocation} numberOfLines={2}>
              {post.place.location}
            </ThemedText>
          </View>
        </TouchableOpacity>
        <FeedFooter post={post} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  userAction: {
    fontSize: 14,
    // lineHeight: 1,
    fontFamily: nunito400regular,
  },
  userName: {
    fontFamily: nunito700bold,
  },
  placeName: {
    fontFamily: nunito700bold,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.light.icon,
    fontFamily: nunito400regular,
    marginTop: -2,
  },
  content: {
    paddingHorizontal: 10, // Align with avatar
    gap: 12,
  },
  placeCard: {
    flexDirection: 'row',
    backgroundColor: 'rgb(255, 236, 217)',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  placeImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeCardContent: {
    justifyContent: 'center',
    flex: 1,
    gap: 4,
  },
  placeCardName: {
    fontSize: 16,
    fontFamily: nunito700bold,
    marginBottom: 0,
    lineHeight: 19,
  },
  placeCardAddress: {
    fontSize: 14,
    color: Colors.light.icon,
    fontFamily: nunito400regular,
  },
  placeCardLocation: {
    fontSize: 14,
    color: Colors.light.icon,
    fontFamily: nunito400regular,
  },
});
