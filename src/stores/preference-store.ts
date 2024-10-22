// src/stores/counter-store.ts
import { persist, createJSONStorage } from "zustand/middleware";
import { create } from "zustand";
import { PartOfSpeech } from "@/types/types";
import { fontNames } from "@/utils/fontNames";
const defaultColours: { [key: string]: [string, string] } = {
  ADJ: ["#832CC2", "#B87EE2"],
  CIRC: ["#1604B9", "#9388FC"],
  COM: ["#1604B9", "#9388FC"],
  CONJ: ["#1604B9", "#9388FC"],
  REM: ["#1604B9", "#9388FC"],
  RSLT: ["#1604B9", "#9388FC"],
  COND: ["#e37010", "#E47821"],
  INL: ["#e37010", "#E47821"],
  LOC: ["#e37010", "#E47821"],
  PREV: ["#e37010", "#E47821"],
  T: ["#e37010", "#E47821"],
  OBJ2: ["#5c7085", "#8798AB"],
  DEM: ["#bf9f3e", "#bf9f3e"],
  DET: ["#575757", "#969696"],
  INTG: ["#fd5162", "#FD5E6E"],
  N: ["#548dd4", "#6498D8"],
  SUBJ: ["#548dd4", "#6498D8"],
  NEG: ["#F66B41", "#FF6161"],
  PRO: ["#f4400b", "#F66B41"],
  PN: ["#257e9c", "2FA1C3"],
  P: ["#ad2323", "#E37878"],
  PRP: ["#817418", "#A8981F"],
  REL: ["#817418", "#A8981F"],
  SUB: ["#817418", "#A8981F"],
  V: ["#32bd2f", "#32bd2f"],
  VOC: ["#32bd2f", "#32bd2f"],
  OBJ: ["#5c7085", "#8798AB"],
  others: ["#a8017b", "#FE48CE"],
};
type PreferenceStore = {
  translation_ids: string[];
  setTranslation_ids: (translation_ids: string[]) => void;
  showTranslation: boolean;
  setShowTranslation: (showTranslation: boolean) => void;
  showTransliteration: boolean;
  setShowTransliteration: (showTranslation: boolean) => void;
  colours: { [key: string]: [string, string] };
  setColours: (pos: string, value: string, value2: string) => void;
  font: (typeof fontNames)[number];
  setFont: (font: (typeof fontNames)[number]) => void;
};
export const usePreferenceStore = create<PreferenceStore>()(
  persist(
    (set) => ({
      translation_ids: ["20", "131"],
      setTranslation_ids: (translation_ids: string[]) =>
        set({ translation_ids }),
      showTranslation: true,
      setShowTranslation: (showTranslation: boolean) =>
        set({ showTranslation }),
      showTransliteration: true,
      setShowTransliteration: (showTransliteration: boolean) =>
        set({ showTransliteration }),
      colours: defaultColours,
      setColours: (pos, value, value2) => {
        set((state) => {
          return { colours: { ...state.colours, [pos]: [value, value2] } };
        });
      },
      font: "Noto_Sans_Arabic",
      setFont: (font: (typeof fontNames)[number]) => set({ font }),
    }),

    {
      name: "preference-storage",
      skipHydration: true,
    }
  )
);
