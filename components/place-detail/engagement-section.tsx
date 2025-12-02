import { Avatar } from '@/components/avatar';
import { ThemedText } from '@/components/themed-text';
import { PinDetail } from '@/hooks/use-pin';
import { StyleSheet, View } from 'react-native';

export function EngagementSection({
  createdBy,
}: {
  createdBy: PinDetail['createdBy'];
}) {
  return (
    <View style={styles.engagementSection}>
      <Avatar imageUri={createdBy?.avatar} name={createdBy?.name} size={24} />
      <ThemedText type="dimmed" style={styles.pinnedBy}>
        Encontrado por{' '}
        <ThemedText type="defaultSemiBold" style={styles.pinnedByUsername}>
          {createdBy?.username || ''}
        </ThemedText>
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  pinnedByUsername: {
    fontSize: 15,
  },
  engagementSection: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  pinnedBy: {
    fontSize: 14,
  },
});
