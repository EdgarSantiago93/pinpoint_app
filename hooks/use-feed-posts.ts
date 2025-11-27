import { apiRequest } from '@/utils/api';
import { useInfiniteQuery } from '@tanstack/react-query';

export type FeedPostUser = {
  id: string;
  username: string | null;
  name: string | null;
  avatar: string | null;
};

export type FeedPostPlace = {
  id: string;
  title: string;
  description: string | null;
  address: string | null;
  color: string | null;
  icon: string | null;
  latitude: number | null;
  longitude: number | null;
  rating: number | null;
  //
  //
  //
  images?: string[];
};

export type FeedPostItem = {
  id: string;
  type: 'pinned_place' | 'visit';
  userId: string;
  placeId: string;
  createdById: string;
  status: string;
  isDeleted: number;
  deletedAt: number | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  user: FeedPostUser | null;
  place: FeedPostPlace | null;
};

export type FeedResponse = {
  items: FeedPostItem[];
  total: number;
  limit: number;
  offset: number;
};

interface UseFeedPostsOptions {
  limit?: number; // default 20
  enabled?: boolean;
}

export function useFeedPosts(options: UseFeedPostsOptions = {}) {
  const { limit = 20, enabled = true } = options;

  return useInfiniteQuery({
    queryKey: ['feedPosts', { limit }],
    queryFn: async ({ pageParam = 0 }): Promise<FeedResponse> => {
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        offset: pageParam.toString(),
      });

      return apiRequest<FeedResponse>(`/feed?${queryParams.toString()}`);
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce(
        (sum, page) => sum + page.items.length,
        0
      );
      if (totalLoaded < lastPage.total) {
        return totalLoaded;
      }
      return undefined;
    },
    initialPageParam: 0,
    enabled,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
