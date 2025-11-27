import { create } from 'zustand';

interface BottomNavigationStore {
  isVisible: boolean;
  setVisible: (visible: boolean) => void;
}

export const useBottomNavigationStore = create<BottomNavigationStore>((set) => ({
  isVisible: true,
  setVisible: (visible: boolean) => set({ isVisible: visible }),
}));

