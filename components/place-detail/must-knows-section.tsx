import { SkeletonBox } from '@/components/pageComponents/profile/skeleton';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
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
  isLoading?: boolean;
}

export function MustKnowsSection({
  mustKnows,
  displayedCount = 4,
  mustKnowVotes,
  onVote,
  onSeeAll,
  isLoading,
}: MustKnowsSectionProps) {
  if (!mustKnows || mustKnows.length === 0) return null;

  const displayedMustKnows = mustKnows.slice(0, displayedCount);

  console.log('mustKnows', mustKnowVotes);
  return (
    <View style={styles.mustKnowsSection}>
      <TouchableOpacity
        onPress={onSeeAll}
        style={styles.mustKnowsHeader}
        disabled={!onSeeAll || isLoading}
      >
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Must knows
        </ThemedText>
        {isLoading ? null : (
          <ThemedText type="dimmed" style={styles.seeAllText}>
            Ver todos ({mustKnows.length})
          </ThemedText>
        )}
      </TouchableOpacity>

      {isLoading ? (
        <View style={styles.mustKnowsGrid}>
          <SkeletonBox
            height={24}
            width={'100%'}
            style={styles.mustKnowCardSkeleton}
          />
          <SkeletonBox
            height={24}
            width={'100%'}
            style={styles.mustKnowCardSkeleton}
          />
        </View>
      ) : (
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mustKnowCardSkeleton: {
    flex: 1,
    maxWidth: '45%',
    minWidth: '45%',
    aspectRatio: 1,
    backgroundColor: Colors.light.tint + 10,
    padding: 16,
    borderRadius: 12,
    justifyContent: 'space-between',
  },

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
