import { cn } from "@/lib/utils";
import { WORD } from "@/types/types";
import React, { useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import Word from "./Word";
import { usePreferenceStore } from "@/stores/preference-store";
import { useShallow } from "zustand/react/shallow";

export default function Sentence({
  sentence,
  correctIndex,
  selected,
  correct,
}: {
  sentence: WORD[] | undefined;
  correctIndex: number;
  selected: 1 | 2 | 3 | 4 | undefined;
  correct: boolean;
}) {
  const [showTranslation, showTransliteration] = usePreferenceStore(
    useShallow((a) => [a.showTranslation, a.showTransliteration])
  );
  useEffect(() => {
    usePreferenceStore.persist.rehydrate();
  }, []);

  return (
    <>
      {sentence ? (
        sentence.map((word, index) => {
          const [s, v, w] = word.index.split(":");

          if (word.char_type_name !== "word") return "";
          if (index == correctIndex && !selected && !correct)
            return (
              <div
                key={word.index}
                className="flex flex-col justify-center items-center"
              >
                <div className={""}>{"_?_?_?_"}</div>{" "}
                {showTranslation && (
                  <div className="dark:text-red-100 text-red-950 text-xs">
                    {word.translation.text}{" "}
                  </div>
                )}{" "}
              </div>
            );
          return (
            <div
              key={word.index}
              className="flex flex-col justify-center items-center"
            >
              <div
                className={cn(
                  "p-2",
                  index == correctIndex &&
                    "border-2 p-2 rounded border-green-500"
                )}
              >
                <Word {...{ wordSegments: word.wordSegments, word }} />
              </div>
              <div className="">
                {showTransliteration && (
                  <div className="dark:text-green-100 text-green-950  text-sm">
                    {word.transliteration.text}
                  </div>
                )}
                {showTranslation && (
                  <div className="dark:text-red-100 text-red-950 text-xs">
                    {word.translation.text}{" "}
                  </div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <>
          <Skeleton className="w-[75vw] h-[45px] rounded-full" />
        </>
      )}
    </>
  );
}
