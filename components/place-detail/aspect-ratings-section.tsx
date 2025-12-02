import { ASPECTS } from '@/components/aspect-list';
import { SkeletonBox } from '@/components/pageComponents/profile/skeleton';
import { ThemedText } from '@/components/themed-text';
import { FlexView } from '@/components/ui/flex-view';
import { Colors, nunito700bold } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';
import { FadeInDown } from 'react-native-reanimated';

interface AspectRating {
  aspect: string;
  value: number;
}

interface AspectRatingsSectionProps {
  aspectRatings: AspectRating[];
  isLoading: boolean;
}

export function AspectRatingsSection({
  aspectRatings,
  isLoading,
}: AspectRatingsSectionProps) {
  if (aspectRatings.length === 0) return null;

  return (
    <View style={styles.aspectsSection}>
      <View style={styles.aspectsHeader}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Calificación general por los usuarios
        </ThemedText>
      </View>

      <ThemedText type="dimmed" style={{ fontSize: 16, marginBottom: 16 }}>
        Las personas que han visitado este lugar, han ordenado estos aspectos de
        la siguiente manera:
      </ThemedText>
      <View>
        {isLoading
          ? aspectRatings.map((item, index) => {
              return (
                <FlexView
                  key={`skeleton-${index}`}
                  centerV
                  style={styles.aspectItemContainer}
                >
                  <View style={styles.numberItem}>
                    <Text style={styles.numberText}>{index + 1}.</Text>
                  </View>
                  <SkeletonBox height={24} width={'100%'} />
                </FlexView>
              );
            })
          : aspectRatings.map((item, index) => {
              const aspectInfo = ASPECTS.find(
                (aspect) => aspect.id === item.aspect
              );
              return (
                <FlexView
                  animated
                  entering={FadeInDown.duration(120)
                    .delay(200 + index * 100)
                    .springify()}
                  key={item.aspect}
                  centerV
                  style={styles.aspectItemContainer}
                >
                  <View style={styles.numberItem}>
                    <Text style={styles.numberText}>{index + 1}.</Text>
                  </View>
                  <ThemedText type="defaultSemiBold" style={styles.aspectLabel}>
                    {aspectInfo?.name}
                  </ThemedText>
                </FlexView>
              );
            })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  aspectsSection: {
    marginBottom: 32,
  },
  aspectsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
  },
  aspectLabel: {
    fontSize: 16,
  },
  aspectItemContainer: {
    marginBottom: 8,
  },
  numberItem: {
    width: 30,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.tint + 10,
    borderRadius: 8,
  },
  numberText: {
    fontSize: 18,
    color: Colors.light.tint,
    fontFamily: nunito700bold,
  },
});
