import { AvatarGroup } from '@/components/place-detail/avatar-group';
import { ThemedText } from '@/components/themed-text';
import { StyleSheet, View } from 'react-native';

interface EngagementSectionProps {
  createdBy?: {
    username?: string;
  };
}

export function EngagementSection({ createdBy }: EngagementSectionProps) {
  return (
    <View style={styles.engagementSection}>
      <ThemedText type="dimmed" style={styles.pinnedBy}>
        Pinned by{' '}
        <ThemedText type="defaultSemiBold">
          {createdBy?.username || 'Unknown'}
        </ThemedText>
      </ThemedText>

      <AvatarGroup />
    </View>
  );
}

const styles = StyleSheet.create({
  engagementSection: {
    marginBottom: 24,
  },
  pinnedBy: {
    fontSize: 14,
    marginBottom: 12,
  },
});

