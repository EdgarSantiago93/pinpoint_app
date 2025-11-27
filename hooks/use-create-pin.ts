import { AddPlaceFormData } from '@/stores/add-place-form-store';
import { apiRequest } from '@/utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface PinResponse {
  id: string;
  title: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  category?: string;
  rating?: number;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: {
    id: string;
    username: string;
    name?: string;
    avatar?: string;
  };
  tags?: {
    id: string;
    name: string;
    color?: string;
  }[];
}

export function useCreatePin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: AddPlaceFormData): Promise<PinResponse> => {
      return apiRequest<PinResponse>('/pins', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
    },
    onSuccess: () => {
      // Invalidate user query to refresh pin count
      queryClient.invalidateQueries({ queryKey: ['user'] });
      // Optionally invalidate pins list if you have one
      // queryClient.invalidateQueries({ queryKey: ['pins'] });
    },
  });
}
