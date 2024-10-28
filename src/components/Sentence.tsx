import { cn } from "@/lib/utils";
import { WORD } from "@/types/types";
import React, { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import Word from "./Word";
import { usePreferenceStore } from "@/stores/preference-store";
import { useShallow } from "zustand/react/shallow";
import { ArrowLeftRight } from "lucide-react";
import { Button } from "./ui/button";

export default function Sentence({
  sentence,
  highlightIndex,
  hideIndex,
  switchIndex,
}: {
  sentence: WORD[] | undefined;
  highlightIndex?: number;
  hideIndex?: number;
  switchIndex?: number;
}) {
  const [switchOn, setSwitchOn] = useState(false);
  const [showTranslation, showTransliteration] = usePreferenceStore(
    useShallow((a) => [a.showTranslation, a.showTransliteration])
  );
  useEffect(() => {
    usePreferenceStore.persist.rehydrate();
  }, []);
  useEffect(() => {
    setSwitchOn(false);
  }, [sentence]);
  return (
    <>
      <div className="flex justify-center items-center">
        <div
          dir={switchOn ? "ltr" : "rtl"}
          // style={{
          //   display: "grid",
          //   gridAutoFlow: "column",
          //   gridTemplateColumns: "repeat(auto-fill, min-content)",
          //   gridTemplateRows: "repeat(3, min-content)",
          // }}
          className={cn("flex gap-2 flex-wrap items-center justify-center")}
        >
          {sentence ? (
            sentence.map((word, index) => {
              if (word.char_type_name !== "word") return "";
              if (index == hideIndex)
                return (
                  <>
                    <div
                      key={word.index}
                      className="flex flex-col justify-center items-center "
                    >
                      <div className={"pb-1"}>{"_?_?_?_"}</div>{" "}
                      {showTransliteration && (
                        <div className="dark:text-green-100 text-green-950  text-sm">
                          _?_?_?_
                        </div>
                      )}
                      {showTranslation && (
                        <div className="dark:text-red-100 text-red-950 text-xs justify-self-end">
                          {word.translation.text}{" "}
                        </div>
                      )}{" "}
                    </div>
                  </>
                );
              if (switchOn && index != switchIndex) {
                return (
                  <>
                    <div
                      key={word.index}
                      className="flex flex-col justify-center items-center"
                    >
                      <div className="dark:text-red-100 text-red-950 p-3">
                        {word.translation.text}
                      </div>
                      {showTransliteration && (
                        <div className="dark:text-green-100 text-green-950 p-0 h-5 text-sm">
                          {" "}
                        </div>
                      )}
                      {showTranslation && (
                        <div className="dark:text-red-100 text-red-950 h-4 justify-self-end">
                          {" "}
                        </div>
                      )}
                    </div>
                  </>
                );
              }
              return (
                <>
                  <div
                    key={word.index}
                    className="flex flex-col justify-center items-center"
                  >
                    <div
                      className={cn(
                        index == highlightIndex &&
                          "border-2 p-2 rounded border-green-500"
                      )}
                      dir="rtl"
                    >
                      <Word {...{ wordSegments: word.wordSegments, word }} />
                    </div>
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
                </>
              );
            })
          ) : (
            <>
              <Skeleton className="w-[75vw] h-[45px] rounded-full" />
            </>
          )}
        </div>{" "}
        {
          <Button
            size={"icon"}
            variant={switchOn ? "default" : "ghost"}
            className="rounded-full"
            onClick={() => setSwitchOn(!switchOn)}
          >
            <ArrowLeftRight />
          </Button>
        }
      </div>
    </>
  );
}
