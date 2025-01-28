import { WORD, WordData } from "@/types/types";
import React from "react";
import { usePreferenceStore } from "@/stores/preference-store";
import { useShallow } from "zustand/react/shallow";
import { useTheme } from "next-themes";
import useFont from "@/utils/useFont";
import WordInfo from "./WordInfo";
import { buckwalterToArabic } from "@/utils/arabic-buckwalter-transliteration";

function Word({
  wordSegments,
  noWordInfo,
  word,
  size,
}: {
  wordSegments: WordData;
  noWordInfo?: boolean;
  word?: WORD;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
}) {
  const [colours] = usePreferenceStore(useShallow((a) => [a.colours]));
  const { systemTheme, theme } = useTheme();
  const [font] = useFont();
  return (
    <>
      <WordInfo
        {...{
          wordSegments,
          disabled: noWordInfo,
          word,
          size,
        }}
      >
        <div className={font?.className}>
          {wordSegments.map((segment, index) => (
            <div
              key={segment.position + ":" + index}
              style={{
                color: (colours[segment.partOfSpeech] ?? colours.others)[
                  (theme == "system" ? systemTheme : theme) == "dark" ? 1 : 0
                ],
              }}
              className="inline"
            >
              {buckwalterToArabic(
                segment.buckwalter,
                wordSegments.length - 1 > index,
                index != 0
              ).trim()}
            </div>
          ))}
        </div>
      </WordInfo>
    </>
  );
}

export default Word;
