import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';

export const AvatarGroup = () => {
  return (
    <View style={styles.likesSection}>
      <View style={styles.avatarContainer}>
        {/* Mock avatars */}
        <View style={[styles.avatar, styles.avatar1]} />
        <View style={[styles.avatar, styles.avatar2]} />
        <View style={[styles.avatar, styles.avatar3]} />
      </View>
      <ThemedText type="defaultSemiBold" style={styles.likesText}>
        724 people love this place
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  likesSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  likesText: {
    fontSize: 14,
  },
  avatarContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.light.background,
    marginLeft: -8,
  },
  avatar1: {
    backgroundColor: '#FF6B6B',
    zIndex: 3,
  },
  avatar2: {
    backgroundColor: '#4ECDC4',
    zIndex: 2,
  },
  avatar3: {
    backgroundColor: '#FFE66D',
    zIndex: 1,
  },
});
