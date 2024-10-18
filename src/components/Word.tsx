import { WordData } from "@/types/types";
import React from "react";
import { usePreferenceStore } from "@/stores/preference-store";
import { useShallow } from "zustand/react/shallow";
import { useTheme } from "next-themes";
import useFont from "@/utils/useFont";

function Word({ wordSegments }: { wordSegments: WordData }) {
  const [colours] = usePreferenceStore(useShallow((a) => [a.colours]));
  const { theme, setTheme } = useTheme();
  const [font] = useFont();

  return (
    <div className={font?.className}>
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
