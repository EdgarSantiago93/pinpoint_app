// stores/add-place-form-store.ts
import { PinIcons } from '@/components/pin-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
export interface MediaItem {
  uri: string;
  type: 'image' | 'video';
  thumbnail?: string;
}

export interface AddPlaceFormData {
  description: string;
  tags: string;
  musts?: string[];
  placeData?: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    placeId: string;
    types: string[];
    city: string;
    neighborhood: string;
    country: string;
  };
  selectedColor?: string;
  selectedIcon?: string;
  rating?: number;
  aspects?: string[]; // Array of aspect IDs in the order the user arranged them
  media?: MediaItem[]; // Array of selected media (images/videos)
  visitDate?: Date | string; // Visit date for the place
}

// Color swatches for random selection
const colorSwatches = [
  '#c94726', // Red
  '#FF6B6B', // Light Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#F39C12', // Orange
  '#9B59B6', // Purple
  '#E74C3C', // Dark Red
];

// Function to generate fresh random initial data
const generateInitialFormData = (): AddPlaceFormData => {
  const randomIconIndex = Math.floor(Math.random() * PinIcons.length);
  const randomColorIndex = Math.floor(Math.random() * colorSwatches.length);

  return {
    description: '',
    tags: '',
    musts: [],
    selectedColor: colorSwatches[randomColorIndex],
    selectedIcon: PinIcons[randomIconIndex].name,
    rating: 0.0,
    visitDate: new Date().toISOString(),
    placeData: {
      name: '',
      address: '',
      latitude: 0,
      longitude: 0,
      placeId: '',
      types: [],
      city: '',
      neighborhood: '',
      country: '',
    },
    media: [],
    aspects: [],
  };
};

interface AddPlaceFormStore {
  formData: AddPlaceFormData;
  updateFormData: (data: Partial<AddPlaceFormData>) => void;
  resetFormData: () => void;
}

export const useAddPlaceFormStore = create<AddPlaceFormStore>()(
  persist(
    (set) => ({
      formData: generateInitialFormData(),
      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      resetFormData: () => set({ formData: generateInitialFormData() }),
    }),
    {
      name: 'add-place-form-storage', // unique name
      storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage for persistence
    }
  )
);
