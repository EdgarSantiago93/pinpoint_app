import { ThemedText } from '@/components/themed-text';
import { nunito400regular } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';

interface DescriptionSectionProps {
  description?: string;
}

export function DescriptionSection({ description }: DescriptionSectionProps) {
  if (!description) return null;

  return (
    <View style={styles.descriptionSection}>
      <ThemedText type="default" style={styles.description}>
        {description}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  descriptionSection: {
    marginBottom: 32,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: nunito400regular,
  },
});

