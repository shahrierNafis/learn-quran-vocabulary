import React, { memo, useEffect, useState } from "react";

import getVerseWords from "@/utils/getVerseWords";

import { WORD } from "@/types/types";

import { cn } from "@/lib/utils";

import { Skeleton } from "./ui/skeleton";

import getVerseTranslations from "@/utils/getVerseTranslations";

import Translations from "./Translations";

import Word from "./Word";
import { usePreferenceStore } from "@/stores/preference-store";
import { useShallow } from "zustand/react/shallow";

export default memo(
  function CellComponent({
    verse_key,
    translation_ids,
  }: {
    verse_key: `${string}:${string}${string}`;
    translation_ids: string[];
  }) {
    const [sentence, setSentence] = useState<WORD[]>();
    const [translations, setTranslations] =
      useState<Awaited<ReturnType<typeof getVerseTranslations>>>();
    const [showTranslation, showTransliteration] = usePreferenceStore(
      useShallow((a) => [a.showTranslation, a.showTransliteration])
    );

    useEffect(() => {
      usePreferenceStore.persist.rehydrate();
    }, []);

    // set sentence
    useEffect(() => {
      getVerseWords(verse_key).then(setSentence);

      return () => {};
    }, [verse_key]);
    // set translation
    useEffect(() => {
      const [surah, verse] = verse_key.split(":");
      getVerseTranslations(translation_ids, `${surah}:${verse}`).then((r) =>
        setTranslations(r)
      );

      return () => {};
    }, [translation_ids, verse_key]);

    const [s, v, w] = verse_key.split(":");

    return (
      <>
        <>
          <div className="flex flex-col gap-2 justify-center items-center">
            <div
              dir="rtl"
              className="flex gap-2 flex-wrap  text-center text-2xl"
            >
              {/* ARABIC */}
              {sentence ? (
                sentence.map((word, index) => {
                  if (word.char_type_name !== "word") return "";
                  return (
                    <>
                      <div key={word.index} className="flex flex-col">
                        <div
                          className={cn(
                            "p-2",
                            +verse_key.split(":")[2] &&
                              index == +verse_key.split(":")[2] - 1 &&
                              "border-2 p-2 rounded border-green-500"
                          )}
                        >
                          <Word wordSegments={word.wordSegments} />
                        </div>
                        <div className="">
                          {showTransliteration && (
                            <div className="dark:text-green-100 text-green-950 text-sm">
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
            </div>
            {/* TRANSLATION */}
            <Translations
              {...{ translations, index: verse_key }}
            ></Translations>
          </div>
        </>
      </>
    );
  },
  (prev, next) => {
    return (
      prev.verse_key == next.verse_key &&
      prev.translation_ids.every((e, i) => next.translation_ids[i] == e)
    );
  }
);

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
