import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { Word } from "@/types/types";

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
  return (
    <>
      <div className="grid grid-cols-2 gap-8">
        {allOptions.length == 4 && allOptions.every((el) => el) ? (
          allOptions.map(({ index, text_imlaei }) => {
            return (
              <Button
                disabled={(correct || selected) && true}
                className={cn(
                  "text-3xl h-full px-8 py-6", //
                  selected &&
                    (currentWord === index
                      ? "bg-green-500 text-white"
                      : "bg-gray-500 text-white"),
                  selected === index &&
                    (index === currentWord
                      ? "ring-4 ring-white"
                      : "ring-4 ring-red-500")
                )}
                key={index}
                onClick={() => onClick(index)}
              >
                {text_imlaei}
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
