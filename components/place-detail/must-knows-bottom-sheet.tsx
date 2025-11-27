// import BottomSheet, {
//   BottomSheetBackdrop,
//   BottomSheetBackdropProps,
//   BottomSheetView,
// } from '@gorhom/bottom-sheet';
// import React, {
//   useCallback,
//   useImperativeHandle,
//   useMemo,
//   useRef,
// } from 'react';
// import { StyleSheet, Text, View } from 'react-native';
// import { ScrollView } from 'react-native-gesture-handler';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// interface MustKnow {
//   id: string;
//   content: string;
// }

// interface MustKnowsBottomSheetProps {
//   mustKnows: MustKnow[];
//   mustKnowVotes: Record<string, 'up' | 'down' | null>;
//   onVote: (mustKnowId: string, vote: 'up' | 'down') => void;
// }

// export interface MustKnowsBottomSheetRef {
//   present: () => void;
//   dismiss: () => void;
// }

// export const MustKnowsBottomSheet = React.forwardRef<
//   MustKnowsBottomSheetRef,
//   MustKnowsBottomSheetProps
// >(({ mustKnows, mustKnowVotes, onVote }, ref) => {
//   const bottomSheetModalRef = useRef<BottomSheet>(null);

//   // const bottomSheetModalRef = useRef<BottomSheetModal>(null);
//   const insets = useSafeAreaInsets();

//   useImperativeHandle(ref, () => ({
//     present: () => {
//       bottomSheetModalRef.current?.snapToIndex(0);
//       // bottomSheetModalRef.current?.present();
//     },
//     dismiss: () => {
//       console.log('dismiss');
//       bottomSheetModalRef.current?.close();
//       // bottomSheetModalRef.current?.dismiss();
//     },
//   }));

//   const renderBackdrop = useCallback(
//     (props: BottomSheetBackdropProps) => (
//       <BottomSheetBackdrop
//         {...props}
//         disappearsOnIndex={-1}
//         appearsOnIndex={0}
//         opacity={0.5}
//       />
//     ),
//     []
//   );
//   const data = useMemo(
//     () =>
//       Array(50)
//         .fill(0)
//         .map((_, index) => `index-${index}`),
//     []
//   );
//   // const renderItem = useCallback(
//   //   (item) => (
//   //     <View key={item} style={styles.itemContainer}>
//   //       <Text>{item}</Text>
//   //     </View>
//   //   ),
//   //   []
//   // );

//   // render
//   const renderSectionHeader = useCallback(
//     ({ section }) => (
//       <View style={styles.sectionHeaderContainer}>
//         <Text>{section.title}</Text>
//       </View>
//     ),
//     []
//   );
//   const renderItem = useCallback(
//     ({ item }) => (
//       <View style={styles.itemContainer}>
//         <Text>{item}</Text>
//       </View>
//     ),
//     []
//   );
//   // callbacks
//   const handleSheetChange = useCallback((index) => {
//     console.log('handleSheetChange', index);
//   }, []);
//   const handleSnapPress = useCallback((index) => {
//     bottomSheetModalRef.current?.snapToIndex(index);
//   }, []);
//   const handleClosePress = useCallback(() => {
//     bottomSheetModalRef.current?.close();
//   }, []);
//   const sections = useMemo(
//     () =>
//       Array(10)
//         .fill(0)
//         .map((_, index) => ({
//           title: `Section ${index}`,
//           data: Array(10)
//             .fill(0)
//             .map((_, index) => `Item ${index}`),
//         })),
//     []
//   );
//   return (
//     <BottomSheet
//       ref={bottomSheetModalRef}
//       index={-1}
//       snapPoints={['50%']}
//       enableDynamicSizing={false}
//       // onChange={handleSheetChange}
//       //
//       //
//       //

//       backdropComponent={renderBackdrop}
//       enablePanDownToClose
//       enableContentPanningGesture={true}
//       enableOverDrag={false}
//       enableHandlePanningGesture={true}
//       // backgroundStyle={styles.background}
//       handleIndicatorStyle={styles.handleIndicator}
//     >
//       {/* <BottomSheetSectionList
//         sections={sections}
//         keyExtractor={(i) => i}
//         renderSectionHeader={renderSectionHeader}
//         renderItem={renderItem}
//         contentContainerStyle={styles.contentContainer}
//       /> */}
//       <BottomSheetView style={styles.contentContainer}>
//         <Text>Awesome 🔥</Text>

//         <ScrollView
//           style={{ backgroundColor: 'red', height: '100%', maxHeight: '400' }}
//         >
//           <Text>Awesomefirt 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome 🔥</Text>
//           <Text>Awesome last🔥</Text>
//         </ScrollView>
//       </BottomSheetView>
//     </BottomSheet>

//     // /*
//     // <BottomSheetModal
//     // ref={bottomSheetModalRef}
//     // index={0} // Starts at first snap point (50%)
//     // snapPoints={['50%']} // Can snap to 50% or 80%, but not beyond
//     // backdropComponent={renderBackdrop}
//     // enablePanDownToClose
//     // enableContentPanningGesture={true}
//     // enableOverDrag={false} // Prevents dragging beyond the last snap point
//     // enableHandlePanningGesture={true}
//     // backgroundStyle={styles.background}
//     // handleIndicatorStyle={styles.handleIndicator}
//     // >
//     // <BottomSheetScrollView
//     //   contentContainerStyle={{ backgroundColor: 'blue' }}
//     // >
//     //   {data.map(renderItem)}
//     // </BottomSheetScrollView>
//     //  <BottomSheetView
//     //   style={[
//     //     styles.bottomSheetContent,
//     //     { paddingBottom: insets.bottom + 20 },
//     //   ]}
//     // >

//     //   <View style={styles.bottomSheetHeader}>
//     //     <ThemedText type="title-serif">Must Knows</ThemedText>
//     //     <TouchableOpacity>
//     //       <IconReload
//     //         size={24}
//     //         color={Colors.light.text}
//     //         style={{ transform: [{ rotate: '180deg' }] }}
//     //       />
//     //     </TouchableOpacity>
//     //   </View>
//     //   <ScrollView
//     //     // style={styles.bottomSheetScroll}
//     //     // contentContainerStyle={styles.bottomSheetScrollContent}
//     //     showsVerticalScrollIndicator={false}
//     //   >
//     //     <View style={styles.allMustKnowsGrid}>
//     //       {mustKnows.map((must) => (
//     //         <MustKnowCard
//     //           key={must.id}
//     //           mustKnow={must}
//     //           vote={mustKnowVotes[must.id]}
//     //           onVote={onVote}
//     //           fullWidth={true}
//     //         />
//     //       ))}
//     //       {mustKnows.map((must) => (
//     //         <MustKnowCard
//     //           key={must.id}
//     //           mustKnow={must}
//     //           vote={mustKnowVotes[must.id]}
//     //           onVote={onVote}
//     //           fullWidth={true}
//     //         />
//     //       ))}
//     //     </View>
//     //   </ScrollView>
//     // </BottomSheetView> */
//   );
// });

// MustKnowsBottomSheet.displayName = 'MustKnowsBottomSheet';

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 200,
//   },
//   contentContainer: {
//     backgroundColor: 'white',
//   },
//   sectionHeaderContainer: {
//     backgroundColor: 'white',
//     padding: 6,
//   },
//   itemContainer: {
//     padding: 6,
//     margin: 6,
//     backgroundColor: '#eee',
//   },

//   //
//   //
//   //
//   //
//   // itemContainer: {
//   //   padding: 6,
//   //   margin: 6,
//   //   backgroundColor: '#eee',
//   // },
//   // //
//   // background: {
//   //   backgroundColor: 'white',
//   //   borderTopLeftRadius: 20,
//   //   borderTopRightRadius: 20,
//   // },
//   handleIndicator: {
//     backgroundColor: '#D1D5DB',
//     width: 40,
//     height: 4,
//   },
//   // bottomSheetContent: {
//   //   flex: 1,
//   //   paddingHorizontal: 16,
//   //   paddingVertical: 12,
//   // },
//   // bottomSheetHeader: {
//   //   flexDirection: 'row',
//   //   justifyContent: 'space-between',
//   //   alignItems: 'center',
//   //   marginBottom: 8,
//   // },

//   // bottomSheetScroll: {
//   //   flex: 1,
//   // },
//   // bottomSheetScrollContent: {
//   //   paddingBottom: 20,
//   //   flex: 1,
//   // },

// });

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
        opacity={0.5}
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
        // one scrollable child – this avoids the measurement bugs
        contentContainerStyle={{
          paddingTop: 4,
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 16,
        }}
        stickyHeaderIndices={[0]} // header stays pinned; remove if you want it to scroll away
        showsVerticalScrollIndicator
      >
        {/* HEADER (index 0, sticky) */}
        <View style={styles.bottomSheetHeader}>
          <View style={styles.bottomSheetHeader}>
            <ThemedText type="title-serif">Must Knows</ThemedText>
            <TouchableOpacity>
              <IconReload
                size={24}
                color={Colors.light.text}
                style={{ transform: [{ rotate: '180deg' }] }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* <View style={styles.bottomSheetHeader}>
         
        </View> */}

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
