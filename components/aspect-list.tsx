import { ThemedText } from '@/components/themed-text';
import {
  Colors,
  dmserif,
  nunito600semibold,
  nunito700bold,
} from '@/constants/theme';
import { IconInfoCircle, IconX } from '@tabler/icons-react-native';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useCallback, useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { SortableGridRenderItem } from 'react-native-sortables';
import Sortable from 'react-native-sortables';

type Aspect = {
  id: string;
  name: string;
  description: string;
  color: string;
};

export const ASPECTS: Aspect[] = [
  {
    id: 'food_quality',
    name: '🍽️ Calidad de la comida',
    description: 'Sabor, frescura, consistencia y presentación.',
    color: '#D4A574', // Soft terracotta/beige
  },
  {
    id: 'service',
    name: '👥 Servicio',
    description:
      'Atención del personal, rapidez, amabilidad y profesionalismo.',
    color: '#C97A7A', // Soft dusty rose
  },
  {
    id: 'atmosphere',
    name: '🎵 Ambiente',
    description: 'Vibra, música, iluminación, nivel de ruido y decoración.',
    color: '#B89A9A', // Soft mauve
  },
  {
    id: 'cleanliness',
    name: '✨ Limpieza',
    description: 'Higiene del lugar, mesas, pisos y baños.',
    color: '#A68B7A', // Soft taupe
  },
  {
    id: 'value',
    name: '💰 Relación calidad-precio',
    description: 'Qué tan justo es el precio considerando la experiencia.',
    color: '#C99A7A', // Soft peachy beige
  },
];

interface AspectListProps {
  aspects?: string[]; // Array of aspect IDs in order
  onAspectsChange?: (aspectIds: string[]) => void;
}

export default function AspectList({
  aspects,
  onAspectsChange,
}: AspectListProps = {}) {
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const colors = Colors['light'];
  const opacity = useSharedValue(0);

  // Get ordered aspects based on the provided order, or use default order
  const getOrderedAspects = useCallback((): Aspect[] => {
    if (!aspects || aspects.length === 0) {
      return ASPECTS;
    }

    // Create a map for quick lookup
    const aspectMap = new Map(ASPECTS.map((aspect) => [aspect.id, aspect]));

    // Order aspects according to the provided order
    const ordered: Aspect[] = [];
    const seen = new Set<string>();

    // Add aspects in the specified order
    for (const id of aspects) {
      const aspect = aspectMap.get(id);
      if (aspect) {
        ordered.push(aspect);
        seen.add(id);
      }
    }

    // Add any remaining aspects that weren't in the order
    for (const aspect of ASPECTS) {
      if (!seen.has(aspect.id)) {
        ordered.push(aspect);
      }
    }

    return ordered;
  }, [aspects]);

  const [orderedAspects, setOrderedAspects] =
    useState<Aspect[]>(getOrderedAspects());

  // Update ordered aspects when aspects prop changes
  useEffect(() => {
    setOrderedAspects(getOrderedAspects());
  }, [getOrderedAspects]);

  // Animation duration in milliseconds
  const ANIMATION_DURATION = 220;

  useEffect(() => {
    if (showInfoDialog) {
      opacity.value = withTiming(1, { duration: ANIMATION_DURATION });
    } else {
      opacity.value = withTiming(0, { duration: ANIMATION_DURATION });
    }
  }, [showInfoDialog, opacity]);

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        {
          scale: 0.9 + opacity.value * 0.1, // Slight scale animation
        },
      ],
    };
  });

  const renderItem = useCallback<SortableGridRenderItem<Aspect>>(
    ({ item }) => (
      <View style={[styles.card, { borderColor: item.color }]}>
        <Text style={styles.text} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    ),
    []
  );
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 8,
          display: 'flex',
          width: '100%',
        }}
      >
        <View
          style={{
            flex: 90,
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <ThemedText type="subtitle">
            Cómo ordenarias los siguientes aspectos sobre este lugar?
          </ThemedText>
        </View>
        <View style={{ flex: 10, alignItems: 'flex-end' }}>
          <TouchableOpacity onPress={() => setShowInfoDialog(true)}>
            <IconInfoCircle size={22} color={colors.tint} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Info Dialog Modal */}
      <Modal
        visible={showInfoDialog}
        transparent
        animationType="none"
        onRequestClose={() => setShowInfoDialog(false)}
      >
        <Animated.View style={[styles.modalOverlay, overlayAnimatedStyle]}>
          <Animated.View style={[styles.modalContent, contentAnimatedStyle]}>
            <View style={{ width: '100%' }}>
              <ThemedText type="title-serif" style={styles.modalTitle}>
                Reordenar aspectos
              </ThemedText>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowInfoDialog(false)}
            >
              <IconX size={24} color={colors.text} />
            </TouchableOpacity>

            <ThemedText style={styles.modalText}>
              Arrastra y suelta los aspectos para reordenarlos según tu opinión.
              El número 1 será el que consideres más relevante para este lugar.
            </ThemedText>

            {/* GIF - replace the URI with your actual GIF path or URL */}
            <View style={styles.gifContainer}>
              <Image
                source={require('@/assets/media/reorder.gif')}
                style={styles.gif}
                contentFit="contain"
                placeholder={{ blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
              />
            </View>

            <TouchableOpacity
              style={[styles.okButton, { backgroundColor: colors.tint }]}
              onPress={() => setShowInfoDialog(false)}
            >
              <ThemedText style={styles.okButtonText}>Ok</ThemedText>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Modal>

      <View style={styles.container}>
        <View style={styles.numberList}>
          {[1, 2, 3, 4, 5].map((num) => (
            <View key={num} style={styles.numberItem}>
              <Text style={styles.numberText}>{num}.</Text>
            </View>
          ))}
        </View>
        {/* Sortable grid on the right */}
        <View style={styles.gridContainer}>
          <Sortable.Grid
            columns={1}
            data={orderedAspects}
            renderItem={renderItem}
            rowGap={8}
            showDropIndicator
            onOrderChange={(params) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
            onDragStart={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
            onDragEnd={(params) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

              // Get the new order from indexToKey array
              const newAspectIds = params.indexToKey.map((key) => key);

              // Update local state
              const newOrderedAspects = newAspectIds
                .map((id) => orderedAspects.find((aspect) => aspect.id === id))
                .filter((aspect): aspect is Aspect => aspect !== undefined);

              setOrderedAspects(newOrderedAspects);
              onAspectsChange?.(newAspectIds);
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: 10,
    height: 65,
    justifyContent: 'center',
    padding: 12,
    width: '100%',
    borderWidth: 2,
  },
  container: {
    flexDirection: 'row',
    padding: 10,
  },
  gridContainer: {
    flex: 1,
    minWidth: 0, // Important: allows flex item to shrink below content size
  },
  numberList: {
    marginRight: 15,
    justifyContent: 'space-between',
    paddingVertical: 0,
  },
  numberItem: {
    width: 30,
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 8,
  },
  numberText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: nunito700bold,
  },
  text: {
    color: Colors.light.text,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    fontFamily: dmserif,
  },
  description: {
    color: Colors.light.text,
    fontSize: 13,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 13,
    fontFamily: nunito600semibold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF7F0',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    zIndex: 1,
  },
  modalTitle: {
    marginBottom: 16,
    // textAlign: 'left',
  },
  modalText: {
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'left',
    marginBottom: 24,
    color: Colors.light.text,
  },
  gifContainer: {
    width: '100%',
    height: 200,
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  gif: {
    width: '100%',
    height: '100%',
  },
  okButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 120,
  },
  okButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
