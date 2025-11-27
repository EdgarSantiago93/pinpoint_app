import { FeedPost, FeedPostType } from '@/components/feed';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, nunito700bold } from '@/constants/theme';
import { FeedPostItem, useFeedPosts } from '@/hooks/use-feed-posts';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

// Mock data generator - replace with actual API calls
// const generateMockPosts = (
//   count: number,
//   offset: number = 0
// ): FeedPostType[] => {
//   const posts: FeedPostType[] = [];
//   const types: FeedPostItem['type'][] = ['pinned_place', 'visit'];

//   for (let i = 0; i < count; i++) {
//     const index = offset + i;
//     const type = types[index % types.length];

//     if (type === 'ranking') {
//       posts.push({
//         id: `ranking-${index}`,
//         type: 'ranking',
//         user: {
//           id: `user-${index}`,
//           name: 'Judy',
//           avatar:
//             'https://lh3.googleusercontent.com/aida-public/AB6AXuBLu5xQGZMo_7DEzjf6nE0YXW4CsCcMKoLVM9nkyiSOyEpQyL32_KR8XR8KzAuuiENkLeXUOSo84V8WkmwHtwrYQMU7bptq4KbH65FA1hjDMCJC8BjODcHj663DQIVq24QjwwYmdOJgQ8KPMlCPY6jn0vvcNiCVnCdopmbixfqyHL1qIU4tJiEwDqSnfd3aerGfeozSKRArI6c2IQqjQeF6tRqkYt9bjxZKmMtAn3P-csT-vD1DDQtPh34VSyp0RsXUJ8W0KbPFw0M',
//         },
//         timestamp: index === 0 ? '2 hours ago' : `${index + 1} hours ago`,
//         place: {
//           id: `place-${index}`,
//           name: 'Ramen By Ra',
//           location: 'Williamsburg, Brooklyn, NYC, USA',
//         },
//         rating: 9.6,
//         visitCount: 3,
//         notes:
//           'The new location is officially open! The ramen is excellent and the space is beautiful.',
//         images: [
//           'https://lh3.googleusercontent.com/aida-public/AB6AXuCJnciPhcS6lq256p95I4XbCf0NYqzaKqqPWBEuKclSsNNJORJIE-PeCqy4_WEVTchJkaOezb78R7HZsB5zFNcmkx_vd1i_fTyxunMsrx6068M5_CwKn2gEM6xUrmyKtSp7DIgbPlIHUuWbFseR7XlTV1b6xkTGg2Cl6SSRhG1P8EGz0CrREqsGrYCEkGA7fwHKZK3TtiS2GOr925egqFMvHNTnbf2jhbcpUZcD1yw9ydkvD4DFfOtjmOT3XMe7ADEkWqKVRbbeHSM',
//           'https://lh3.googleusercontent.com/aida-public/AB6AXuCJnciPhcS6lq256p95I4XbCf0NYqzaKqqPWBEuKclSsNNJORJIE-PeCqy4_WEVTchJkaOezb78R7HZsB5zFNcmkx_vd1i_fTyxunMsrx6068M5_CwKn2gEM6xUrmyKtSp7DIgbPlIHUuWbFseR7XlTV1b6xkTGg2Cl6SSRhG1P8EGz0CrREqsGrYCEkGA7fwHKZK3TtiS2GOr925egqFMvHNTnbf2jhbcpUZcD1yw9ydkvD4DFfOtjmOT3XMe7ADEkWqKVRbbeHSM',
//           'https://lh3.googleusercontent.com/aida-public/AB6AXuCJnciPhcS6lq256p95I4XbCf0NYqzaKqqPWBEuKclSsNNJORJIE-PeCqy4_WEVTchJkaOezb78R7HZsB5zFNcmkx_vd1i_fTyxunMsrx6068M5_CwKn2gEM6xUrmyKtSp7DIgbPlIHUuWbFseR7XlTV1b6xkTGg2Cl6SSRhG1P8EGz0CrREqsGrYCEkGA7fwHKZK3TtiS2GOr925egqFMvHNTnbf2jhbcpUZcD1yw9ydkvD4DFfOtjmOT3XMe7ADEkWqKVRbbeHSM',
//           'https://lh3.googleusercontent.com/aida-public/AB6AXuCJnciPhcS6lq256p95I4XbCf0NYqzaKqqPWBEuKclSsNNJORJIE-PeCqy4_WEVTchJkaOezb78R7HZsB5zFNcmkx_vd1i_fTyxunMsrx6068M5_CwKn2gEM6xUrmyKtSp7DIgbPlIHUuWbFseR7XlTV1b6xkTGg2Cl6SSRhG1P8EGz0CrREqsGrYCEkGA7fwHKZK3TtiS2GOr925egqFMvHNTnbf2jhbcpUZcD1yw9ydkvD4DFfOtjmOT3XMe7ADEkWqKVRbbeHSM',
//           'https://lh3.googleusercontent.com/aida-public/AB6AXuCJnciPhcS6lq256p95I4XbCf0NYqzaKqqPWBEuKclSsNNJORJIE-PeCqy4_WEVTchJkaOezb78R7HZsB5zFNcmkx_vd1i_fTyxunMsrx6068M5_CwKn2gEM6xUrmyKtSp7DIgbPlIHUuWbFseR7XlTV1b6xkTGg2Cl6SSRhG1P8EGz0CrREqsGrYCEkGA7fwHKZK3TtiS2GOr925egqFMvHNTnbf2jhbcpUZcD1yw9ydkvD4DFfOtjmOT3XMe7ADEkWqKVRbbeHSM',
//           'https://lh3.googleusercontent.com/aida-public/AB6AXuCJnciPhcS6lq256p95I4XbCf0NYqzaKqqPWBEuKclSsNNJORJIE-PeCqy4_WEVTchJkaOezb78R7HZsB5zFNcmkx_vd1i_fTyxunMsrx6068M5_CwKn2gEM6xUrmyKtSp7DIgbPlIHUuWbFseR7XlTV1b6xkTGg2Cl6SSRhG1P8EGz0CrREqsGrYCEkGA7fwHKZK3TtiS2GOr925egqFMvHNTnbf2jhbcpUZcD1yw9ydkvD4DFfOtjmOT3XMe7ADEkWqKVRbbeHSM',
//           'https://lh3.googleusercontent.com/aida-public/AB6AXuArzk_T7yf7VPd02SNHY-MMxGVt7wXL_8UPwVwj-Mc_K7anphfNHM-BA1JqRbWUUvDsZYWGl65wo3iYYzpbzYXpEid3bDJ68RXup0dVObEpe-R5DIPC925Mht3D0XKJT1Mmt-FVIxcgz8uX7NtMN48mXzLJ-VrIK9kvD94MFNXgXy08UTpNAud1OiJtPB0DMqTbu7F1QoAt01-ErmjqcjbHgjCd6T1oZw9HK7gir7I0fzbgnpdYlvAxBYC8qcPy_TxVgO9Hc9r6zlY',
//           'https://lh3.googleusercontent.com/aida-public/AB6AXuAglvZ49_hogJylrkL7t2esuFZw8_QYT-5rVrN5mj1KkMtuiW7jzb4X44QP4AWv6d7wZrZyR8rlFPNZuOaR91n-fCz5Z9-AFVZz434-4d0DtrHClJ-2xplE3ySajgr7oK_AI48jK6WJFD06B-qNuYG5vX87jJ8-tUOVViPcaa8waV4gnUYFXLEy-EEO8Zznv61leXq0siFylktsSsfsg6-HpfiSHt18r5HHLykh6jnZbwbaNaMo8KcrRudBdJ1OFipFxW_ZwsbHSHo',
//         ],
//       });
//     } else if (type === 'pinned_place') {
//       posts.push({
//         id: `pinned-${index}`,
//         type: 'pinned_place',
//         user: {
//           id: `user-${index}`,
//           name: 'John D.',
//           avatar:
//             'https://lh3.googleusercontent.com/aida-public/AB6AXuC_UB51cCv4vHut9tjaLVMMkE3K9u3p0o6gztHovtH28ziKrydjYknxAJJ0g58Dgmj8vq91KLanJfZ4Z5iXnIkdd5K0ls1nwXKpRLL71YKLhofTgB7GgcZSrLCwia72w8RgEm-BR5PqwOvYTd-9mPAoeZWSzHkhkR-275FjYKF0vfnngkYdHqozVBQIh0IJ2Dv0oX0q0w5IUqDkjwHUH0-ERA_oTiQSgIp_esvLy040-VJ3Ov4w9mX4g3cLjk9YpL8Fk63UXTrE1Lc',
//         },
//         timestamp: index === 0 ? 'Yesterday' : `${index} days ago`,
//         place: {
//           id: `place-${index}`,
//           name: 'Shikaumi Shrine',
//           description: "Dragon's nest: goshuincho",
//           location: 'Shikanoshima, Fukuoka, Japan',
//           mapImage:
//             'https://lh3.googleusercontent.com/aida-public/AB6AXuD0lK6VFM0KEqb74YhDN5Hz0SO9c-_AZOjbmD2ONz8UoecfYL2SP_u1PIGUOKbZ1P387Scy9_ufBDnxfffwx4i-3YazNhlSkrTKqvFBunhxGMfMMFLllJQVnWI1dfah9F1H5__LiS1s-cwljfWnfUxvqTq9rAOUB7KzH727Ndp4WMofyjRBZpbHZTLZe_XlrRjdmHbEpASW3wj670a2SexRuxeUBKk46tK9EFfR5ffy6VJ_VQsGPJqfUVOcaBjwPz_qhpqG2OiCR_g',
//         },
//       });
//     } else {
//       posts.push({
//         id: `visit-${index}`,
//         type: 'visit',
//         user: {
//           id: `user-${index}`,
//           name: 'Maria S.',
//           avatar:
//             'https://lh3.googleusercontent.com/aida-public/AB6AXuC9hMjvDuqatT2QkgLjf6AyICBFC9WX-Yz4kKaA0mWGtmY5F0aaku5ROd_i-UxIwW27DFlFhHVlYoFztdDIhrDz2MxWB9fvoMiEHecg4mqHvOX-Y05Ktlce2JtNnQrvwmpnuekD1hl_fpCfkngW2gGExSVEWYZP8dhLz18RIjqu_jhRyLKw9kvzIfDP9nHYYpLRlZiYUwCwfCQN_rhID0WvnFNxYRlu2rUx7Owjdh2oPRG2pdzjOZ7qBBzitfDA4V5nlTZzs4Dbvl4',
//         },
//         timestamp: index === 0 ? '3 days ago' : `${index + 3} days ago`,
//         place: {
//           id: `place-${index}`,
//           name: 'Los Danzantes Oaxaca',
//           address: 'Macedonio Alcalá 403',
//           location: 'Centro, Oaxaca de Juárez, Mexico',
//           image:
//             'https://lh3.googleusercontent.com/aida-public/AB6AXuD8u4p0YHPeRuUjy6avprgw07jalkT4v7Ie7_tcMARGPN56-81HDUXptPgCBfExIazKkss8cSDyOnKwuvMfqQx5e1Na4O14piZ_DVsdnNKfdY5_7auGXpCs3l9ZCSFHAYMAfGtP_uaIyx5q-Y-bS9PTmBlfeYp10nv9Cvt4WhTeUfqWulIJHBWpYST2QjQoHiAqVRYapfkMMgaS_F4ccpo9K1HqCbZ8An_kF-iKpyBNftYN9j0aXGsC9_W0rFC3C_jlEIXBT1cUpwI',
//         },
//         visitCount: 1,
//       });
//     }
//   }

//   return posts;
// };

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const listRef = useRef<FlashListRef<FeedPostItem>>(null);

  const scrollToTop = useCallback(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  const { data, fetchNextPage, hasNextPage, isFetching, refetch, isLoading } =
    useFeedPosts({
      limit: 20,
    });
  const isGlobalLoading = isLoading || isFetching;

  const handleFetchNextPage = useCallback(async () => {
    console.log('handleFetchNextPage');
    if (hasNextPage && !isGlobalLoading) {
      setIsFetchingMore(true);
      fetchNextPage().finally(() => {
        setIsFetchingMore(false);
      });
    }
  }, [hasNextPage, isGlobalLoading, fetchNextPage]);

  // Access all feed posts
  const allPosts = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data]
  );

  const handlePostPress = useCallback((post: FeedPostType) => {
    // Navigate to place detail or post detail
    if (post.type === 'ranking' || post.type === 'visit') {
      router.push(`/pages/pin/${post.place.id}`);
    } else if (post.type === 'pinned_place') {
      router.push(`/pages/pin/${post.place.id}`);
    }
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: FeedPostItem; index: number }) => (
      <FeedPost
        post={item}
        onPress={() => handlePostPress(item)}
        index={index}
      />
    ),
    [handlePostPress]
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.light.tint} />
      </View>
    );
  }, [isFetchingMore]);

  const renderEmpty = useCallback(() => {
    return (
      <View style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>No hay publicaciones</ThemedText>
      </View>
    );
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ThemedView
        style={[
          styles.container,
          // { paddingBottom: Math.max(insets.bottom, 20) + 80 },
        ]}
      >
        <TouchableOpacity onPress={scrollToTop}>
          <View style={{ paddingHorizontal: 16 }}>
            <ThemedText type="title-serif" style={{ fontSize: 38 }}>
              Feed
            </ThemedText>
          </View>
        </TouchableOpacity>

        <FlashList
          ref={listRef}
          data={allPosts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingBottom: Math.max(insets.bottom, 20) + 80,
            paddingHorizontal: 16,
          }}
          refreshControl={
            <RefreshControl
              tintColor={Colors.light.tint}
              colors={[Colors.light.tint]}
              refreshing={isGlobalLoading}
              onRefresh={refetch}
            />
          }
          onEndReached={handleFetchNextPage}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EAEAEA',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: nunito700bold,
  },

  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
  },
});
