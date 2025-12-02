import { SkeletonBox } from '@/components/pageComponents/profile/skeleton';
import { Visit } from '@/components/place-detail/visit-history-bottom-sheet';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { IconArrowLeft, IconMapPin } from '@tabler/icons-react-native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface VisitHistorySectionProps {
  visitCount?: number;
  visits?: Visit[];
  isLoading: boolean;
  onPress?: () => void;
}

export function VisitHistorySection({
  visitCount,
  visits = [],
  isLoading,
  onPress,
}: VisitHistorySectionProps) {
  if (!visitCount || visitCount === 0) return null;

  // Get the most recent visit for display
  const lastVisit =
    visits.length > 0
      ? visits.reduce((latest, visit) =>
          visit.visitedAt > latest.visitedAt ? visit : latest
        )
      : null;

  const formatLastVisitDate = (date: Date): string => {
    const day = date.getDate();
    const month = date.toLocaleDateString('es-ES', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <View style={styles.visitHistorySection}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Tus visitas
      </ThemedText>

      {isLoading ? (
        <View>
          <SkeletonBox height={60} width={'100%'} />
        </View>
      ) : visits.length > 0 ? (
        <View style={styles.mustItemEmpty}>
          <ThemedText
            style={[styles.mustText, { textAlign: 'center' }]}
            type="dimmed"
          >
            Aún no has visitado este lugar, agrega una visita para que otros
            usuarios puedan ver tus experiencias.
          </ThemedText>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.visitHistoryCard}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <View style={styles.visitHistoryContent}>
            <IconMapPin size={24} color={Colors.light.tint} />
            <View style={styles.visitHistoryText}>
              <ThemedText
                type="defaultSemiBold"
                style={styles.visitHistoryTitle}
              >
                {lastVisit
                  ? `Última visita: ${formatLastVisitDate(lastVisit.visitedAt)}`
                  : `Has visitado este lugar ${visitCount} ${visitCount === 1 ? 'vez' : 'veces'}`}
              </ThemedText>
              <ThemedText type="dimmed" style={styles.visitHistorySubtitle}>
                Has visitado este lugar {visitCount}{' '}
                {visitCount === 1 ? 'vez' : 'veces'}
              </ThemedText>
            </View>
          </View>
          <IconArrowLeft
            size={20}
            color={Colors.light.icon}
            style={{ transform: [{ rotate: '180deg' }] }}
          />
        </TouchableOpacity>
      )}
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

  mustItemEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors['light'].tint,
    borderStyle: 'dashed',
    backgroundColor: Colors['light'].tint + '10',
    textAlign: 'center',
  },
  mustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  mustText: {
    flex: 1,
    fontSize: 15,
    color: Colors['light'].text,
  },
});
