import { cn } from "@/lib/utils";
import { WORD } from "@/types/types";
import { useLocalStorage } from "@uidotdev/usehooks";
import React from "react";
import { Skeleton } from "./ui/skeleton";
import Word from "./Word";

export default function Sentence({
  sentence,
  correctIndex,
  selected,
}: {
  sentence: WORD[] | undefined;
  correctIndex: number;
  selected: 1 | 2 | 3 | 4 | undefined;
}) {
  const [showTranslation] = useLocalStorage<boolean>("showTranslation", true);
  const [showTransliteration] = useLocalStorage<boolean>(
    "showTransliteration",
    true
  );
  return (
    <>
      {sentence ? (
        sentence.map((word, index) => {
          const [s, v, w] = word.index.split(":");

          if (word.char_type_name !== "word") return "";
          if (index == correctIndex && !selected)
            return (
              <div className={""} key={word.index}>
                {"_?_?_?_"}
              </div>
            );
          return (
            <>
              <div className="flex flex-col justify-center items-center">
                <div
                  className={cn(
                    "p-2",
                    index == correctIndex &&
                      "border-2 p-2 rounded border-green-500"
                  )}
                >
                  <Word {...{ wordSegments: word.wordSegments }} />
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
            </>
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
