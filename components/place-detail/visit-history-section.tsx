import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { IconArrowLeft, IconMapPin } from '@tabler/icons-react-native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface VisitHistorySectionProps {
  visitCount?: number;
}

export function VisitHistorySection({ visitCount }: VisitHistorySectionProps) {
  if (!visitCount || visitCount === 0) return null;

  return (
    <View style={styles.visitHistorySection}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Tus visitas
      </ThemedText>
      <TouchableOpacity style={styles.visitHistoryCard}>
        <View style={styles.visitHistoryContent}>
          <IconMapPin size={24} color={Colors.light.tint} />
          <View style={styles.visitHistoryText}>
            <ThemedText type="defaultSemiBold" style={styles.visitHistoryTitle}>
              Last visited: 24 Sep 2023
            </ThemedText>
            <ThemedText type="dimmed" style={styles.visitHistorySubtitle}>
              Visited {visitCount} times
            </ThemedText>
          </View>
        </View>
        <IconArrowLeft
          size={20}
          color={Colors.light.icon}
          style={{ transform: [{ rotate: '180deg' }] }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  visitHistorySection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  visitHistoryCard: {
    backgroundColor: '#FFF4F2',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  visitHistoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  visitHistoryText: {
    gap: 4,
  },
  visitHistoryTitle: {
    fontSize: 14,
  },
  visitHistorySubtitle: {
    fontSize: 12,
  },
});
