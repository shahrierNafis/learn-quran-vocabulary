import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { Word } from "@/types/types";
import WordImage from "./WordImage";
import { useTheme } from "next-themes";

function Options({
  allOptions,
  correct,
  selected,
  currentWord,
  onClick,
}: {
  allOptions: Word[];
  correct: boolean | undefined;
  currentWord: string;
  selected: `${string}:${string}:${string}` | undefined;
  onClick: (index: `${string}:${string}:${string}`) => Promise<void>;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <div className="grid grid-cols-2 gap-8">
        {allOptions.length == 4 && allOptions.every((el) => el) ? (
          allOptions.map((word) => {
            return (
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                disabled={(correct || selected) && true}
                className={cn(
                  "text-3xl h-full px-8 py-6", //
                  selected &&
                    (currentWord === word.index
                      ? "bg-green-100"
                      : "bg-gray-100 dark:bg-stone-300"),
                  selected === word.index &&
                    (word.index === currentWord
                      ? "ring-4 ring-green-500"
                      : "ring-4 ring-red-500")
                )}
                key={word.index}
                onClick={() => onClick(word.index)}
              >
                <WordImage {...{ word }} />
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
