import {
  Noto_Sans_Arabic,
  Noto_Kufi_Arabic,
  Noto_Naskh_Arabic,
  Amiri_Quran,
} from "next/font/google";
import { WordData } from "@/types/types";
import React from "react";
import { usePreferenceStore } from "@/stores/preference-store";
import { useShallow } from "zustand/react/shallow";
import { useTheme } from "next-themes";

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

function Word({ wordSegments }: { wordSegments: WordData }) {
  const [colours] = usePreferenceStore(useShallow((a) => [a.colours]));
  const { theme, setTheme } = useTheme();
  const [font, setFont] = usePreferenceStore(
    useShallow((a) => [a.font, a.setFont])
  );

  return (
    <div className={googleFonts[font].className}>
      {wordSegments.map((segment) => (
        <div
          key={segment.person}
          style={{
            color: (colours[segment.partOfSpeech] ?? colours.others)[
              theme == "dark" ? 1 : 0
            ],
          }}
          className="inline"
        >
          {segment.arabic.trim()}
        </div>
      ))}
    </div>
  );
}

export default Word;
