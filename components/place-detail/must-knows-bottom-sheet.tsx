import { MustKnowCard } from '@/components/place-detail/must-know-card';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { IconReload } from '@tabler/icons-react-native';
import React, {
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MustKnow {
  id: string;
  content: string;
}

interface MustKnowsBottomSheetProps {
  mustKnows: MustKnow[];
  mustKnowVotes: Record<string, 'up' | 'down' | null>;
  onVote: (mustKnowId: string, vote: 'up' | 'down') => void;
}

export interface MustKnowsBottomSheetRef {
  present: () => void;
  dismiss: () => void;
}

export const MustKnowsBottomSheet = React.forwardRef<
  MustKnowsBottomSheetRef,
  MustKnowsBottomSheetProps
>(({ mustKnows, mustKnowVotes, onVote }, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  const snapPoints = useMemo(() => ['80%'], []);

  useImperativeHandle(ref, () => ({
    present: () => {
      bottomSheetRef.current?.snapToIndex(0);
    },
    dismiss: () => {
      bottomSheetRef.current?.close();
    },
  }));

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.3}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      maxDynamicContentSize={windowHeight * 0.8}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      enableContentPanningGesture
      enableHandlePanningGesture
      enableOverDrag={false}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetScrollView
        style={{
          zIndex: 9999,
        }}
        contentContainerStyle={{
          paddingTop: 4,
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 16,
          zIndex: 999,
        }}
        stickyHeaderIndices={[0]} // header stays pinned; remove if you want it to scroll away
        showsVerticalScrollIndicator
      >
        <View style={styles.bottomSheetHeader}>
          <View style={styles.bottomSheetHeader}>
            <ThemedText type="title-serif">Must Knows</ThemedText>
            <TouchableOpacity>
              <IconReload size={24} color={Colors.light.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.mustKnowsGrid}>
          {mustKnows.map((must) => (
            <MustKnowCard
              key={must.id}
              mustKnow={must}
              vote={mustKnowVotes[must.id]}
              onVote={onVote}
              fullWidth={true}
            />
          ))}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

MustKnowsBottomSheet.displayName = 'MustKnowsBottomSheet';

const styles = StyleSheet.create({
  header: {
    paddingBottom: 8,
    backgroundColor: 'white',
    zIndex: 9999,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  itemContainer: {
    padding: 10,
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  handleIndicator: {
    backgroundColor: '#D1D5DB',
    width: 40,
    height: 4,
  },
  bottomSheetHeader: {
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'white',
  },
  mustKnowsGrid: {
    flex: 1,

    gap: 12,
    paddingBottom: 100,
  },
});
