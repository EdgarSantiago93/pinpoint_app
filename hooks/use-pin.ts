import { apiRequest } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';

export interface PinDetail {
  id: string;
  title: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  category?: string;
  rating?: number;
  color?: string;
  icon?: string;
  media?: {
    id: string;
    url: string;
    metadata?: string;
    type: 'image' | 'video';
  }[];
  locationMetadata?: {
    country?: string;
    city?: string;
    neighborhood?: string;
  };
  createdBy?: {
    id: string;
    username: string;
    name?: string;
    avatar?: string;
  };
  tags?: {
    id: string;
    key: string;
    value: string;
  }[];
  mustKnows?: {
    id: string;
    content: string;
  }[];
  visitCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export function usePin(pinId: string | null) {
  return useQuery({
    queryKey: ['pin', pinId],
    queryFn: async (): Promise<PinDetail> => {
      if (!pinId) throw new Error('Pin ID is required');
      return apiRequest<PinDetail>(`/pins/${pinId}`);
    },
    enabled: !!pinId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
