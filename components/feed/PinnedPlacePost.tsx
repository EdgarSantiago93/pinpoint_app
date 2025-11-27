import { Avatar } from '@/components/avatar';
import { ThemedText } from '@/components/themed-text';
import { nunito400regular, nunito700bold } from '@/constants/theme';
import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import type { PinnedPlacePost } from './types';

interface PinnedPlacePostProps {
  post: PinnedPlacePost;
  onPress?: () => void;
}

export function PinnedPlacePost({ post, onPress }: PinnedPlacePostProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Avatar
          imageUri={post.user.avatar}
          name={post.user.name}
          size={40}
        />
        <View style={styles.headerText}>
          <ThemedText style={styles.userAction}>
            <ThemedText style={styles.userName}>{post.user.name}</ThemedText> pinned a new place
          </ThemedText>
          <ThemedText style={styles.timestamp}>{post.timestamp}</ThemedText>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.placeInfo}>
          <ThemedText style={styles.placeName}>{post.place.name}</ThemedText>
          {post.place.description && (
            <ThemedText style={styles.placeDescription}>
              {post.place.description}
            </ThemedText>
          )}
          <ThemedText style={styles.location}>{post.place.location}</ThemedText>
        </View>

        {post.place.mapImage && (
          <TouchableOpacity
            style={styles.mapImageContainer}
            onPress={onPress}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: post.place.mapImage }}
              style={styles.mapImage}
              contentFit="cover"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
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
    lineHeight: 20,
    fontFamily: nunito400regular,
  },
  userName: {
    fontFamily: nunito700bold,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
    fontFamily: nunito400regular,
  },
  content: {
    paddingLeft: 52, // Align with avatar
    gap: 12,
  },
  placeInfo: {
    gap: 4,
  },
  placeName: {
    fontSize: 16,
    fontFamily: nunito700bold,
    marginBottom: 4,
  },
  placeDescription: {
    fontSize: 14,
    color: '#999',
    fontFamily: nunito400regular,
  },
  location: {
    fontSize: 14,
    color: '#999',
    fontFamily: nunito400regular,
  },
  mapImageContainer: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
});

