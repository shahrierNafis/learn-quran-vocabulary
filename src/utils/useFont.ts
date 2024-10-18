import React from "react";
import {
  Noto_Sans_Arabic,
  Noto_Kufi_Arabic,
  Noto_Naskh_Arabic,
  Amiri_Quran,
} from "next/font/google";
import { usePreferenceStore } from "@/stores/preference-store";
import { useShallow } from "zustand/react/shallow";
import { create } from "zustand/react";
import { NextFont } from "next/dist/compiled/@next/font";
const sans = Noto_Sans_Arabic({
  weight: "400",
  subsets: ["arabic"],
});
const kufi = Noto_Kufi_Arabic({
  weight: "400",
  subsets: ["arabic"],
});
const naskh = Noto_Naskh_Arabic({
  weight: "400",
  subsets: ["arabic"],
});

const amiri_quran = Amiri_Quran({
  weight: "400",
  subsets: ["arabic"],
});
const googleFonts = {
  Noto_Sans_Arabic: sans,
  Noto_Kufi_Arabic: kufi,
  Noto_Naskh_Arabic: naskh,
  Amiri_Quran: amiri_quran,
};

const useStore = create<{
  font: NextFont | null;
  setFont: (font: NextFont) => void;
}>((set) => ({
  font: null,
  setFont: (font: NextFont) => set({ font }),
}));

export default function useFont(): [
  NextFont | null,
  string,
  typeof googleFonts,
] {
  const fontName = usePreferenceStore(useShallow((a) => a.font));
  const { font, setFont } = useStore(useShallow((a) => a));
  setFont(googleFonts[fontName]);

  return [font, fontName, googleFonts];
}
