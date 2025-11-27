// stores/registration-form-store.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface RegistrationFormData {
  email: string;
  verificationCode: string;
  name: string;
  username: string;
  password: string;
  passwordConfirmation: string;
}

interface RegistrationFormStore {
  formData: RegistrationFormData;
  updateFormData: (data: Partial<RegistrationFormData>) => void;
  resetFormData: () => void;
}

const initialFormData: RegistrationFormData = {
  email: '',
  verificationCode: '',
  name: '',
  username: '',
  password: '',
  passwordConfirmation: '',
};

export const useRegistrationFormStore = create<RegistrationFormStore>()(
  persist(
    (set) => ({
      formData: initialFormData,
      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      resetFormData: () => set({ formData: initialFormData }),
    }),
    {
      name: 'registration-form-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);


