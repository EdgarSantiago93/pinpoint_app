import { SkeletonBox } from '@/components/pageComponents/profile/skeleton';
import { ThemedText } from '@/components/themed-text';
import { Colors, nunito400regular } from '@/constants/theme';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface Tag {
  id: string;
  value: string;
}

interface TagsSectionProps {
  tags?: Tag[];
  isLoading: boolean;
}

export function TagsSection({ tags, isLoading }: TagsSectionProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <View style={styles.tagsSection}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Tags
      </ThemedText>
      <View style={styles.tagsContainer}>
        {isLoading ? (
          <View style={styles.tagsContainer}>
            <SkeletonBox height={42} width={120} borderRadius={20} />
            <SkeletonBox height={42} width={120} borderRadius={20} />
            <SkeletonBox height={42} width={120} borderRadius={20} />
          </View>
        ) : (
          tags.map((tag) => (
            <TouchableOpacity key={tag.id} style={styles.tagButton}>
              <ThemedText style={styles.tagText}>{tag.value}</ThemedText>
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tagsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagButton: {
    backgroundColor: '#FFF4F2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${Colors.light.tint}80`,
  },
  tagText: {
    fontSize: 14,
    color: Colors.light.tint,
    fontFamily: nunito400regular,
    fontWeight: '500',
  },
});
