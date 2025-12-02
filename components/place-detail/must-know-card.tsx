import { ThemedText } from '@/components/themed-text';
import { Colors, nunito400regular } from '@/constants/theme';
import {
  IconMoodHappy,
  IconMoodSad,
  IconQuoteFilled,
} from '@tabler/icons-react-native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface MustKnow {
  id: string;
  content: string;
}

interface MustKnowCardProps {
  mustKnow: MustKnow;
  vote?: 'up' | 'down' | null;
  onVote: (mustKnowId: string, vote: 'up' | 'down') => void;
  author?: string;
  fullWidth?: boolean;
}

export function MustKnowCard({
  mustKnow,
  vote,
  onVote,
  author = 'Anónimo',
  fullWidth = false,
}: MustKnowCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(120).delay(200).springify()}
      style={[styles.mustKnowCard, fullWidth && styles.fullWidth]}
    >
      <IconQuoteFilled size={32} color={Colors.light.tint} />
      <ThemedText type="default" style={styles.mustKnowText}>
        {mustKnow.content}
      </ThemedText>

      <View style={styles.mustKnowFooter}>
        <ThemedText type="dimmed" style={styles.mustKnowAuthor}>
          – {author}
        </ThemedText>
        <View style={styles.voteButtons}>
          <TouchableOpacity
            onPress={() => onVote(mustKnow.id, 'up')}
            style={[
              styles.voteButton,
              vote === 'up' && styles.voteButtonActive,
            ]}
          >
            <IconMoodHappy
              size={20}
              color={vote === 'up' ? Colors.light.tint : Colors.light.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onVote(mustKnow.id, 'down')}
            style={[
              styles.voteButton,
              vote === 'down' && styles.voteButtonActive,
            ]}
          >
            <IconMoodSad
              size={20}
              color={vote === 'down' ? Colors.light.tint : Colors.light.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  mustKnowCard: {
    flex: 1,
    maxWidth: '45%',
    minWidth: '45%',
    aspectRatio: 1,
    backgroundColor: Colors.light.tint + 10,
    padding: 16,
    borderRadius: 12,
    justifyContent: 'space-between',
  },
  fullWidth: {
    minWidth: '100%',
    aspectRatio: 0,
  },
  mustKnowText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: nunito400regular,
    flex: 1,
  },
  mustKnowFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  mustKnowAuthor: {
    fontSize: 12,
    flex: 1,
  },
  voteButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  voteButton: {
    padding: 4,
  },
  voteButtonActive: {
    backgroundColor: 'rgba(201, 71, 38, 0.1)',
    borderRadius: 4,
  },
});
