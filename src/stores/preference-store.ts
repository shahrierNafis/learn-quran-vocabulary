// src/stores/counter-store.ts
import { persist, createJSONStorage } from "zustand/middleware";
import { create } from "zustand";

type PreferenceStore = {
  translation_ids: string[];
  setTranslation_ids: (translation_ids: string[]) => void;
  showTranslation: boolean;
  setShowTranslation: (showTranslation: boolean) => void;
  showTransliteration: boolean;
  setShowTransliteration: (showTranslation: boolean) => void;
};

export const usePreferenceStore = create<PreferenceStore>()(
  persist(
    (set) => ({
      translation_ids: ["20"],
      setTranslation_ids: (translation_ids: string[]) => ({ translation_ids }),
      showTranslation: true,
      setShowTranslation: (showTranslation: boolean) => ({ showTranslation }),
      showTransliteration: true,
      setShowTransliteration: (showTranslation: boolean) => ({
        showTranslation,
      }),
    }),

    {
      name: "preference-storage",
      skipHydration: true,
    }
  )
);
