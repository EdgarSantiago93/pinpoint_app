import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { IconPaperclip } from '@tabler/icons-react-native';
import React, {
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface Visit {
  id: string;
  visitedAt: Date;
  description?: string;
  notes?: string;
  isToday?: boolean;
  status?: 'completed' | 'pending' | 'upcoming';
}

interface VisitHistoryBottomSheetProps {
  visits: Visit[];
  visitCount: number;
}

export interface VisitHistoryBottomSheetRef {
  present: () => void;
  dismiss: () => void;
}

const formatDate = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateStr = date.toDateString();
  const todayStr = today.toDateString();
  const yesterdayStr = yesterday.toDateString();

  if (dateStr === todayStr) {
    return 'Today';
  }
  if (dateStr === yesterdayStr) {
    return 'Yesterday';
  }

  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  return `${day} ${month}`;
};

const getMarkerType = (
  visit: Visit,
  index: number,
  total: number
): 'start' | 'completed' | 'pending' | 'upcoming' => {
  if (visit.status === 'completed') return 'completed';
  if (visit.status === 'pending') return 'pending';
  if (index === 0) return 'start';
  return 'upcoming';
};

export const VisitHistoryBottomSheet = React.forwardRef<
  VisitHistoryBottomSheetRef,
  VisitHistoryBottomSheetProps
>(({ visits, visitCount }, ref) => {
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

  // Sort visits by date (newest first)
  const sortedVisits = useMemo(() => {
    return [...visits].sort(
      (a, b) => b.visitedAt.getTime() - a.visitedAt.getTime()
    );
  }, [visits]);

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
        style={styles.scrollView}
        contentContainerStyle={{
          paddingTop: 4,
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 16,
        }}
        showsVerticalScrollIndicator
      >
        <View style={styles.header}>
          <ThemedText type="title-serif" style={styles.title}>
            Tus visitas
          </ThemedText>
          <ThemedText type="dimmed" style={styles.subtitle}>
            {visitCount} {visitCount === 1 ? 'visita' : 'visitas'} total
          </ThemedText>
        </View>

        <View style={styles.timelineContainer}>
          {sortedVisits.map((visit, index) => {
            const markerType = getMarkerType(visit, index, sortedVisits.length);
            const isHighlighted = visit.isToday || visit.status === 'pending';
            const dateStr = formatDate(visit.visitedAt);
            const isLast = index === sortedVisits.length - 1;

            return (
              <View key={visit.id} style={styles.timelineItem}>
                {/* Left side - Date */}
                <View style={styles.dateContainer}>
                  <ThemedText type="dimmed" style={styles.dateText}>
                    {dateStr}
                  </ThemedText>
                  <IconPaperclip
                    size={12}
                    color={Colors.light.icon}
                    style={styles.paperclipIcon}
                  />
                </View>

                {/* Center - Timeline line and marker */}
                <View style={styles.timelineCenter}>
                  {!isLast && <View style={styles.timelineLine} />}
                  <View
                    style={[
                      styles.marker,
                      markerType === 'start' && styles.markerStart,
                      markerType === 'completed' && styles.markerCompleted,
                      markerType === 'pending' && styles.markerPending,
                      markerType === 'upcoming' && styles.markerUpcoming,
                    ]}
                  >
                    {markerType === 'completed' && (
                      <View style={styles.checkmark}>
                        <View style={styles.checkmarkLine1} />
                        <View style={styles.checkmarkLine2} />
                      </View>
                    )}
                    {markerType === 'pending' && <View style={styles.minus} />}
                  </View>
                </View>

                {/* Right side - Event card */}
                <View
                  style={[
                    styles.eventCard,
                    isHighlighted && styles.eventCardHighlighted,
                  ]}
                >
                  <ThemedText type="defaultSemiBold" style={styles.eventTitle}>
                    Visita #{sortedVisits.length - index}
                  </ThemedText>
                  {visit.description && (
                    <ThemedText type="dimmed" style={styles.eventDescription}>
                      {visit.description}
                    </ThemedText>
                  )}
                  {visit.notes && (
                    <ThemedText type="dimmed" style={styles.eventNotes}>
                      {visit.notes}
                    </ThemedText>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

VisitHistoryBottomSheet.displayName = 'VisitHistoryBottomSheet';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  timelineContainer: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
    minHeight: 60,
  },
  dateContainer: {
    width: 60,
    paddingRight: 12,
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 12,
    marginBottom: 4,
  },
  paperclipIcon: {
    marginTop: 2,
  },
  timelineCenter: {
    width: 40,
    alignItems: 'center',
    position: 'relative',
    marginRight: 12,
  },
  timelineLine: {
    position: 'absolute',
    left: '50%',
    top: 20,
    bottom: -24,
    width: 2,
    backgroundColor: Colors.light.tint,
    transform: [{ translateX: -1 }],
    zIndex: 0,
  },
  marker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.light.tint,
    borderWidth: 2,
    borderColor: Colors.light.tint,
    marginTop: 4,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerStart: {
    width: 10,
    height: 10,
    borderRadius: 0,
    backgroundColor: Colors.light.tint,
    borderWidth: 0,
    transform: [{ rotate: '45deg' }],
  },
  markerCompleted: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  markerPending: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  markerUpcoming: {
    backgroundColor: 'transparent',
    borderColor: Colors.light.tint,
  },
  checkmark: {
    width: 10,
    height: 10,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkLine1: {
    position: 'absolute',
    width: 1.5,
    height: 3,
    backgroundColor: 'white',
    transform: [{ rotate: '45deg' }],
    left: 2.5,
    top: 2,
  },
  checkmarkLine2: {
    position: 'absolute',
    width: 1.5,
    height: 5,
    backgroundColor: 'white',
    transform: [{ rotate: '-45deg' }],
    left: 4.5,
    top: 3.5,
  },
  minus: {
    width: 6,
    height: 1.5,
    backgroundColor: 'white',
    borderRadius: 0.75,
  },
  eventCard: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  eventCardHighlighted: {
    backgroundColor: '#E3F2FD',
    padding: 12,
  },
  eventTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
  },
  eventNotes: {
    fontSize: 11,
    color: Colors.light.icon,
    marginTop: 4,
  },
  handleIndicator: {
    backgroundColor: '#D1D5DB',
    width: 40,
    height: 4,
  },
});
