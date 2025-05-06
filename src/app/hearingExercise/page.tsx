"use client";
import React, { use, useCallback, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import VerseLengths, { useVerseLengths } from "./VerseLengths";
import ExtraVerse from "./ExtraVerse";
import Score, { useScoreStore } from "./Score";
import _ from "lodash";
import getVersesWithLength from "./getVersesWithLegnth";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import useVerseAudio from "@/components/useVerseAudio";
import { Button } from "@/components/ui/button";
import { User, Volume2 } from "lucide-react";
import { WORD } from "@/types/types";
import Word from "@/components/Word";
import getVerseWords from "@/utils/getVerseWords";
import { motion } from "framer-motion";
import Translations from "@/components/Translations";
import getVerseTranslations from "@/utils/getVerseTranslations";
import { usePreferenceStore } from "@/stores/preference-store";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useDragControls } from "motion/react";
export const useVerse = create<{
  verse_key: string | null;
  setVerse_key: (verse: string | null) => void;
}>()(
  persist(
    (set, get) => ({
      verse_key: "", // initial state
      setVerse_key: (verse_key: string | null) => set({ verse_key }),
    }),
    {
      name: "verseStorage", // name of the item in the storage (must be unique)
    }
  )
);
export default function Page() {
  const [verseLengths, VLDialogOpen] = useVerseLengths(
    useShallow((state) => [state.verseLengths, state.VLDialogOpen])
  );
  const [extra, setExtra] = useState<number>(3);
  const [addScore] = useScoreStore(useShallow((state) => [state.addScore]));
  const { setVerse_key, verse_key } = useVerse(useShallow((state) => state));
  const { verseAudio, openedVerse, setOpenedVerse } = useVerseAudio();
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [words, setWords] = useState<WORD[]>([]);
  const [verse, setVerse] = useState<WORD[]>([]);
  const [userWords, setUserWords] = useState<WORD[]>([]);
  const [translations, setTranslations] =
    useState<Awaited<ReturnType<typeof getVerseTranslations>>>();
  const [translation_ids] = usePreferenceStore(
    useShallow((a) => [a.translation_ids])
  );
  const [redIndex, setRedIndex] = useState<number>();
  const controls = useDragControls();

  const setRandomVerse = useCallback(() => {
    // set a random verse
    getVersesWithLength(_.shuffle(verseLengths)[0]).then((a) =>
      setVerse_key(_.shuffle(a)[0])
    );
  }, [setVerse_key, verseLengths]);
  useEffect(() => {
    !verse_key && setRandomVerse(); // set a random verse if verse_key is null
    return () => {};
  }, [setRandomVerse, verse_key]);

  useEffect(() => {
    // update audio hook
    verse_key && setOpenedVerse(verse_key);
    return () => {};
  }, [setOpenedVerse, verse_key]);

  useEffect(() => {
    // update audio element
    setAudio(new Audio(verseAudio));
  }, [verseAudio]);

  useEffect(() => {
    // set Words
    if (VLDialogOpen) return; // if dialog is open, do not set words
    setUserWords([]); //reset
    setWords([]);
    // Create an AbortController for this effect instance
    const abortController = new AbortController();
    const signal = abortController.signal;

    (async () => {
      try {
        if (signal.aborted) return;

        let words: WORD[] = [];
        words = await getVerseWords(verse_key as `${string}:${string}`);
        setVerse(words.filter((word) => word.char_type_name == "word"));
        if (signal.aborted) return;

        const lemmas = words
          .map(
            (word) =>
              word.char_type_name == "word" &&
              word.wordSegments.map((wordSegment) => wordSegment.lemma)
          )
          .flat()
          .filter((i) => typeof i === "string");
        console.log(lemmas);

        for (let i = 0; i < extra; i++) {
          if (signal.aborted) return;
          console.log(words);
          const verse = _.shuffle(await getVersesWithLength(verseLengths[0]));
          words = words.concat(
            (await getVerseWords(verse[0] as `${string}:${string}`)).filter(
              (word) => {
                if (word.char_type_name !== "word") return false;
                if (
                  word.wordSegments.some((wordSegment) =>
                    lemmas.includes(wordSegment.lemma ?? "undefined")
                  )
                ) {
                  console.log(word.wordSegments[0].lemma);
                  return false;
                }
                return true;
              }
            )
          );
        }

        if (signal.aborted) return;

        setWords(
          _.shuffle(words.filter((word) => word.char_type_name == "word"))
        );
      } catch (error: any) {
        // Only log non-abort errors
        if (error.name !== "AbortError") {
          console.error("Error fetching words:", error);
        }
      }
    })();
    return () => {
      abortController.abort();
    };
  }, [extra, verseLengths, verse_key, VLDialogOpen]);
  useEffect(() => {
    // set translation
    verse_key &&
      getVerseTranslations(
        translation_ids,
        verse_key as `${string}:${string}`
      ).then((r) => setTranslations(r));

    return () => {};
  }, [translation_ids, verse_key]);

  return (
    <>
      <div className="flex items-center justify-center w-full h-full gap-4 p-4">
        <VerseLengths />
        <ExtraVerse {...{ setExtra }} />
        <Score />
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-4 p-4">
          {/* audio Btn */}
          <Button
            onClick={() => {
              if (!audio) return;
              audio.currentTime = 0;
              audio?.play();
              if (userWords.length !== verse.length) {
                setUserWords([]); // penalty
                setWords((prev) => {
                  return _.shuffle([...prev, ...userWords]);
                });
              }
            }}
            className="rounded-full aspect-square mx-auto"
            variant={"outline"}
            size={"icon"}
          >
            <Volume2 />
          </Button>
          {/* new Btn */}
          <Button
            variant={"outline"}
            onClick={() => confirm("Are you sure!") && setRandomVerse()}
          >
            new
          </Button>
        </div>
        <Button size={"sm"} className="text-sm" disabled variant={"outline"}>
          Verse {verse_key} with length {verse.length}
        </Button>
        <div
          dir="rtl"
          className="flex flex-wrap items-center justify-center w-full gap-4 p-4"
        >
          {userWords.map((word) => {
            return (
              <motion.div
                key={word.index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  damping: 20,
                  stiffness: 300,
                }}
                layout
              >
                <Button className="text-3xl" variant={"outline"} size={"lg"}>
                  <Word
                    {...{
                      wordSegments: word.wordSegments,
                      word,
                      size: "lg",
                    }}
                  />
                </Button>
              </motion.div>
            );
          })}
        </div>
        {/* TRANSLATION */}
        <Translations {...{ translations, index: verse_key! }}></Translations>
        <div
          dir="rtl"
          className="flex flex-wrap items-center justify-center w-full gap-4 p-4 overflow-hidden"
        >
          {words.length ? (
            words.map((word, i) => {
              return (
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                  key={word.index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    mass: 2,
                    velocity: 2,
                  }}
                  drag
                  dragControls={controls}
                  layout
                >
                  <Button
                    className={cn("text-3xl")}
                    variant={redIndex === i ? "destructive" : "outline"}
                    size={"lg"}
                    disabled={userWords.length == verse.length}
                    onClick={() => {
                      const [s, v] = verse_key?.split(":") as [string, string];
                      const [cs, cv, cw] = word.index.split(":");
                      if (s != cs || v != cv || +cw != userWords.length + 1) {
                        setRedIndex(i);
                        setTimeout(() => {
                          setRedIndex(undefined);
                          setUserWords([]); // penalty
                          setWords((prev) => {
                            return _.shuffle([...prev, ...userWords]);
                          });
                        }, 150);
                      } else {
                        if (userWords.length + 1 === verse.length) {
                          addScore(
                            (verse.length * verse.length * (extra + 1)) / 4
                          );
                        }
                        setUserWords((prev) => [...prev, word]);
                        setWords((prev) => {
                          return [...prev.filter((i) => i.index != word.index)];
                        });
                      }
                    }}
                  >
                    <Word
                      {...{
                        wordSegments: word.wordSegments,
                        noWordInfo: true,
                        word,
                        size: "lg",
                      }}
                    />
                  </Button>
                </motion.div>
              );
            })
          ) : (
            <>
              {Array(verse.length > 0 ? verse.length * (extra + 1) : 40)
                .fill(1)
                .map((a, i) => {
                  return (
                    <>
                      <Skeleton
                        key={i}
                        className="w-[10vw] h-[48px] rounded-md"
                      />
                    </>
                  );
                })}
            </>
          )}
        </div>
      </div>
    </>
  );
}
