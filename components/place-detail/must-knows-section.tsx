import { ThemedText } from '@/components/themed-text';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MustKnowCard } from './must-know-card';

interface MustKnow {
  id: string;
  content: string;
}

interface MustKnowsSectionProps {
  mustKnows: MustKnow[];
  displayedCount?: number;
  mustKnowVotes: Record<string, 'up' | 'down' | null>;
  onVote: (mustKnowId: string, vote: 'up' | 'down') => void;
  onSeeAll?: () => void;
}

export function MustKnowsSection({
  mustKnows,
  displayedCount = 4,
  mustKnowVotes,
  onVote,
  onSeeAll,
}: MustKnowsSectionProps) {
  if (!mustKnows || mustKnows.length === 0) return null;

  const displayedMustKnows = mustKnows.slice(0, displayedCount);

  return (
    <View style={styles.mustKnowsSection}>
      <TouchableOpacity
        onPress={onSeeAll}
        style={styles.mustKnowsHeader}
        disabled={!onSeeAll}
      >
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Must knows
        </ThemedText>
        <ThemedText type="dimmed" style={styles.seeAllText}>
          Ver todos ({mustKnows.length})
        </ThemedText>
      </TouchableOpacity>
      <View style={styles.mustKnowsGrid}>
        {displayedMustKnows.map((must) => (
          <MustKnowCard
            key={must.id}
            mustKnow={must}
            vote={mustKnowVotes[must.id]}
            onVote={onVote}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mustKnowsSection: {
    marginBottom: 32,
  },
  mustKnowsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
  },
  mustKnowsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
});
