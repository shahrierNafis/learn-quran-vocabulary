import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { OPTION } from "@/types/types";
import Word from "./Word";
import { useTheme } from "next-themes";

function Options({
  allOptions,
  correct,
  selected,
  currentWord,
  onClick,
}: {
  allOptions: OPTION[];
  correct: boolean | undefined;
  currentWord: string;
  selected: 1 | 2 | 3 | 4 | undefined;
  onClick: (isCorrect: boolean, index: 1 | 2 | 3 | 4) => Promise<void>;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <div className="grid grid-cols-2 gap-8">
        {allOptions.length == 4 && allOptions.every((el) => el) ? (
          allOptions.map((option, mapIndex) => {
            return (
              <Button
                variant={"outline"}
                dir="rtl"
                disabled={(correct || selected) && true}
                className={cn(
                  "text-3xl h-full px-8 py-6", //
                  selected &&
                    (option.isCorrect
                      ? "bg-green-100"
                      : "bg-gray-100 dark:bg-stone-300"),
                  selected === option.index &&
                    (option.isCorrect
                      ? "ring-4 ring-green-500"
                      : "ring-4 ring-red-500")
                )}
                key={currentWord + option.index}
                onClick={() => onClick(option.isCorrect, option.index)}
              >
                <Word {...{ wordSegments: option.wordSegments }} />
              </Button>
            );
          })
        ) : (
          <>
            {[1, 2, 3, 4].map((index) => {
              return (
                <Skeleton
                  key={index}
                  className=" text-3xl h-full px-24 py-12"
                />
              );
            })}
          </>
        )}
      </div>
    </>
  );
}

export default Options;
