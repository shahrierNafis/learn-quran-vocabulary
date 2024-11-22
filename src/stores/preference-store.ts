// src/stores/counter-store.ts
import { persist, PersistStorage } from "zustand/middleware";
import { create } from "zustand";
import { fontNames } from "@/utils/fontNames";
import { createClient } from "@/utils/supabase/clients";
import { Database, Json } from "@/database.types";
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
  PN: ["#257e9c", "#2FA1C3"],
  P: ["#ad2323", "#E37878"],
  PRP: ["#817418", "#A8981F"],
  REL: ["#817418", "#A8981F"],
  SUB: ["#817418", "#A8981F"],
  V: ["#32bd2f", "#32bd2f"],
  VOC: ["#32bd2f", "#32bd2f"],
  OBJ: ["#5c7085", "#8798AB"],
  others: ["#a8017b", "#FE48CE"],
};
import superJson from "superjson";

// jsonString === '{"json":{"date":"1970-01-01T00:00:00.000Z"},"meta":{"values":{date:"Date"}}}'
const supabase = createClient<Database>();
// Custom storage object
const storage: PersistStorage<PreferenceStore> = {
  getItem: (name: string) => {
    const str = localStorage.getItem(name);
    if (!str) return null;

    return superJson.parse(str);
  },
  setItem: async (name, value) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      supabase
        .from("user_preference")
        .upsert({ preference: superJson.stringify(value), user_id: user.id })
        .then();
    }
    localStorage.setItem(name, superJson.stringify(value) as string);
  },
  removeItem: (name: string) => {
    console.log(name, "has been deleted");
  },
};
type reviewOrderType =
  | "next_review ASC"
  | "next_review DESC"
  | "level ASC"
  | "level DESC"
  | "random";
type PreferenceStore = {
  translation_ids: string[];
  setTranslation_ids: (translation_ids: string[]) => void;
  showTranslation: boolean;
  setShowTranslation: (showTranslation: boolean) => void;

  showTranslationOnHiddenWords: boolean;
  setShowTranslationOnHiddenWords: (
    showTranslationOnHiddenWords: boolean
  ) => void;

  showTransliteration: boolean;
  setShowTransliteration: (showTranslation: boolean) => void;
  colours: { [key: string]: [string, string] };
  setColours: (pos: string, value: string, value2: string) => void;
  font: (typeof fontNames)[number];
  resetColours: () => void;
  setFont: (font: (typeof fontNames)[number]) => void;
  intervals: {
    [key: number]: number;
  };
  setInterval: (percentage: number, interval: number) => void;
  removeInterval: (percentage: number) => void;
  reviewOrder: reviewOrderType;
  setReviewOrder: (reviewOrder: reviewOrderType) => void;
  reciter_id: string;
  setReciter_id: (reciter_id: string) => void;
};
export const usePreferenceStore = create<PreferenceStore>()(
  persist(
    (set) => {
      return {
        translation_ids: ["20", "131"],
        setTranslation_ids: (translation_ids: string[]) =>
          set({ translation_ids }),
        showTranslation: true,
        setShowTranslation: (showTranslation: boolean) =>
          set({ showTranslation }),
        showTranslationOnHiddenWords: false,
        setShowTranslationOnHiddenWords: (
          showTranslationOnHiddenWords: boolean
        ) => set({ showTranslationOnHiddenWords }),
        showTransliteration: true,
        setShowTransliteration: (showTransliteration: boolean) =>
          set({ showTransliteration }),
        colours: defaultColours,
        setColours: (pos, value, value2) => {
          set((state) => {
            return { colours: { ...state.colours, [pos]: [value, value2] } };
          });
        },
        resetColours: () => set(() => ({ ...{ colours: defaultColours } })),
        font: "Noto_Sans_Arabic",
        setFont: (font: (typeof fontNames)[number]) => set({ font }),
        intervals: {
          25: 86400000,
          50: 864000000,
          75: 2592000000,
          100: 15552000000,
        },
        setInterval: (percentage, interval) =>
          set((state) => ({
            intervals: {
              ...state.intervals,
              [percentage]: interval,
            },
          })),
        removeInterval: (percentage) => {
          set((prev) => {
            const newIntervals = { ...prev.intervals };
            delete newIntervals[percentage];
            return { intervals: newIntervals };
          });
        },
        reviewOrder: "next_review ASC",
        setReviewOrder: (reviewOrder: reviewOrderType) => set({ reviewOrder }),
        reciter_id: 7 + "",
        setReciter_id: (reciter_id) => set({ reciter_id }),
      };
    },

    {
      version: 4,
      name: "preference-storage",
      skipHydration: true,
      storage: storage,
    }
  )
);

usePreferenceStore.persist.onHydrate(async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data, error } = await supabase
      .from("user_preference")
      .select("*")
      .single();
    if (data?.preference && !error) {
      usePreferenceStore.setState(
        (state) => (superJson.parse(data.preference as string) as any).state
      );
    }
  }
});
