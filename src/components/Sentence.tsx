import { cn } from "@/lib/utils";
import { Word } from "@/types/types";
import { useLocalStorage } from "@uidotdev/usehooks";
import React from "react";
import { Skeleton } from "./ui/skeleton";

export default function Sentence({
  sentence,
  correctIndex,
  selected,
}: {
  sentence: Word[] | undefined;
  correctIndex: number;
  selected: `${string}:${string}:${string}` | undefined;
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
          if (word.char_type_name !== "word") return "";
          if (index == correctIndex && !selected) return <>{"{{ _._._._ }}"}</>;
          return (
            <>
              <div className="flex flex-col">
                <div className={cn(index == correctIndex && "text-green-500")}>
                  {word.text_imlaei}
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
