import { Avatar } from '@/components/avatar';
import { renderStarIcons } from '@/components/place-detail/renderStarIcons';
import { ThemedText } from '@/components/themed-text';
import { FlexView } from '@/components/ui/flex-view';
import {
  Colors,
  nunito400regular,
  nunito600semibold,
  nunito700bold,
} from '@/constants/theme';
import { FeedPostItem } from '@/hooks/use-feed-posts';
import { formatDate } from '@/utils/utils';
import { StyleSheet, Text, View } from 'react-native';

const friends = ['Edgar', 'Joss', 'Mel'];

const FeedTitle = ({
  post,
  onPress,
}: {
  post: FeedPostItem;
  onPress?: () => void;
}) => {
  if (!post.user || !post.place) return null;
  console.log('post', post);
  return (
    <View style={styles.header}>
      <Avatar
        imageUri={post.user.avatar || ''}
        name={post.user.name || ''}
        size={42}
      />
      <View style={styles.headerText}>
        <ThemedText style={styles.userAction}>
          <ThemedText style={styles.userName}>{post.user.name}</ThemedText>{' '}
          visitó{' '}
          <ThemedText style={styles.placeName}>{post.place.title}</ThemedText>{' '}
          con{' '}
          {friends.map((friend, index) => (
            <ThemedText key={friend}>
              <ThemedText style={styles.userAction}>
                {index > 0 && (index === friends.length - 1 ? ' y ' : ', ')}
              </ThemedText>

              <ThemedText style={styles.placeName}>{friend}</ThemedText>
            </ThemedText>
          ))}
        </ThemedText>

        <FlexView centerV>
          <ThemedText style={styles.timestamp}>
            {formatDate(new Date(post.createdAt))}
            <Text style={{ color: Colors.light.icon + 70 }}>{'  • '}</Text>
          </ThemedText>

          <View style={styles.starsContainer}>
            {renderStarIcons({ rating: post.place?.rating || 0 })}
            <ThemedText type="dimmed" style={styles.ratingText}>
              ({post.place?.rating})
            </ThemedText>
          </View>
        </FlexView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    // color: Colors.light.icon,
    fontFamily: nunito400regular,
    marginTop: -2,
    color: Colors.light.icon,
  },

  ////

  ratingText: {
    marginTop: -2,

    fontSize: 12,
    fontFamily: nunito600semibold,
    color: Colors.light.icon,
  },
  starsContainer: {
    marginTop: -2,

    flexDirection: 'row',
    alignItems: 'center',
  },

  // content: {
  //   paddingLeft: 52, // Align with avatar
  //   gap: 12,
  // },
  // placeCard: {
  //   flexDirection: 'row',
  //   backgroundColor: 'rgb(255, 236, 217)',
  //   padding: 12,
  //   borderRadius: 12,
  //   gap: 12,
  // },
  // placeImage: {
  //   width: 64,
  //   height: 64,
  //   borderRadius: 8,
  //   backgroundColor: Colors.light.background,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // placeCardContent: {
  //   justifyContent: 'center',
  //   flex: 1,
  //   gap: 4,
  // },
  // placeCardName: {
  //   fontSize: 16,
  //   fontFamily: nunito700bold,
  //   marginBottom: 0,
  //   lineHeight: 19,
  // },
  // placeCardAddress: {
  //   fontSize: 14,
  //   color: Colors.light.icon,
  //   fontFamily: nunito400regular,
  // },
  // placeCardLocation: {
  //   fontSize: 14,
  //   color: Colors.light.icon,
  //   fontFamily: nunito400regular,
  // },
  // visitBadge: {
  //   alignSelf: 'flex-start',
  //   backgroundColor: '#E3655B1A', // 10% opacity
  //   paddingHorizontal: 8,
  //   paddingVertical: 4,
  //   borderRadius: 12,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   gap: 4,
  // },
  // visitBadgeText: {
  //   fontSize: 12,
  //   fontFamily: nunito600semibold,
  //   color: '#E3655B',
  // },
});

export default FeedTitle;
