"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import ExtraWords from "./ExtraWords";
import Score from "./Score";
import _ from "lodash";
import useVerseAudio from "@/components/useVerseAudio";
import { Button } from "@/components/ui/button";
import { WORD } from "@/types/types";
import Word from "@/components/Word";
import getVerseWords from "@/utils/getVerseWords";
import { motion } from "framer-motion";
import Translations from "@/components/Translations";
import getVerseTranslations from "@/utils/getVerseTranslations";
import { useOnlineStorage } from "@/stores/onlineStorage";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Verse from "@/components/Verse";
import { useLocalStorage } from "@/stores/localStorage";
import SelectChapters from "./SelectChapters";
import wordCount from "../../wordCount.json";
import getChapterLength from "./getChapterLength";
const wc = wordCount as { [key: number]: { [key: number]: string } };
export default function Page() {
  useEffect(() => {
    useLocalStorage.persist.rehydrate();
    useOnlineStorage.persist.rehydrate();
  }, []);

  const [extraWordsPerWord, chapters, VFSDialogOpen, penalty, setPenalty] =
    useLocalStorage(
      useShallow((state) => [
        state.extraWordsPerWord,
        state.chapters,
        state.VFSDialogOpen,
        state.penalty,
        state.setPenalty,
      ])
    );
  const [addScore, addWOEProgress] = useOnlineStorage(
    useShallow((state) => [state.addWOEscore, state.addWOEProgress])
  );
  const WOEProgress = useOnlineStorage(
    useShallow((state) => state.WOEProgress)
  );
  const [verse_key, setVerse_key] = useState<string | null>();
  const { openedVerse, setOpenedVerse } = useVerseAudio();
  const [words, setWords] = useState<WORD[]>([]);
  const [verse, setVerse] = useState<WORD[]>([]);
  const [userWords, setUserWords] = useState<WORD[]>([]);
  const [translations, setTranslations] =
    useState<Awaited<ReturnType<typeof getVerseTranslations>>>();
  const [translation_ids] = useOnlineStorage(
    useShallow((a) => [a.translation_ids])
  );
  const [redIndex, setRedIndex] = useState<number>();
  const [show, setShow] = useState(false);
  const [green, setGreen] = useState(false);
  const setNextVerse = useCallback(() => {
    const sortedWOEProgress = Object.entries(
      Object.fromEntries(chapters.map((k) => [k, WOEProgress[k]]))
    ).sort((a, b) => {
      const iterationA = a[1] / getChapterLength(+a[0]);
      const iterationB = b[1] / getChapterLength(+b[0]);
      if (iterationA == iterationB) {
        return +a[0] - +b[0]; // put chapters with lower index first
      }
      return iterationA - iterationB; // put chapters with lower iteration first
    });
    const nextChapter = sortedWOEProgress[0];
    nextChapter
      ? setVerse_key(
          `${nextChapter[0]}:${Math.trunc((nextChapter[1] % getChapterLength(+nextChapter[0])) + 1)}` // set the next verse
        )
      : setVerse_key(null);
    setUserWords([]); // clear user input
  }, [WOEProgress, chapters]);
  useEffect(() => {
    if (VFSDialogOpen) return; // if dialog is open, do not set words
    chapters.length && setNextVerse(); // set a next verse if verse_key is null
    return () => {};
  }, [VFSDialogOpen, chapters.length, setNextVerse]);
  useEffect(() => {
    console.log("hit WOEProgress");
    return () => {};
  }, [WOEProgress]);

  useEffect(() => {
    // set Words
    setUserWords([]); //reset
    setWords([]);
    setVerse([]);
    if (!verse_key) return; // if verse_key is null, do not set words
    // Create an AbortController for this effect instance
    const abortController = new AbortController();
    const signal = abortController.signal;

    (async () => {
      try {
        if (signal.aborted) return;

        const words: WORD[] = [];
        words.push(
          ...(await getVerseWords(verse_key as `${string}:${string}`)).filter(
            (word) => word.char_type_name == "word"
          )
        );
        setVerse(words.filter((word) => word.char_type_name == "word"));

        if (signal.aborted) return;
        const extraWords: WORD[] = [];
        while (extraWords.length < extraWordsPerWord * words.length) {
          if (signal.aborted) return;
          console.log(words);
          const rs = Math.floor(Math.random() * Object.keys(wc).length); //random chapter
          const rv = Math.floor(Math.random() * Object.keys(wc[rs]).length); // random verse
          extraWords.push(
            ...(await getVerseWords(`${rs}:${rv}`)).filter(
              (word) => word.char_type_name == "word"
            )
          );
        }

        if (signal.aborted) return;

        setWords(
          _.shuffle([
            ...words,
            ...extraWords.slice(0, extraWordsPerWord * words.length),
          ])
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
  }, [extraWordsPerWord, verse_key]);
  useEffect(() => {
    // set translation
    translation_ids &&
      verse_key &&
      getVerseTranslations(
        translation_ids,
        verse_key as `${string}:${string}`
      ).then((r) => setTranslations(r));

    return () => {};
  }, [translation_ids, verse_key]);

  function penaltyFunc() {
    if (
      userWords.length !== verse.length && // if verse is not complete
      userWords.length && // if userWords is not empty
      openedVerse !== verse_key // if audio is not playing
    ) {
      if (penalty) {
        setUserWords([]); // penalty
        setWords((prev) => {
          return _.shuffle([...prev, ...userWords]);
        });
      }
    }
  }
  return (
    <>
      <div className="p-2 ">
        <div className="flex flex-wrap items-end justify-center gap-4 my-4">
          <SelectChapters />
          <Button
            variant={"outline"}
            onClick={() => {
              setPenalty(!penalty);
            }}
          >
            {penalty ? "penalty:on" : "penalty:off"}
          </Button>
          <ExtraWords />
          <Score />
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={show ? "secondary" : "outline"}
              onClick={() => {
                setShow(!show);
                penaltyFunc();
              }}
            >
              Read/Listen Verse
            </Button>
            {/* reload Btn */}
            <Button
              className={cn(`${green && "ring ring-green-400"}`)}
              variant={"outline"}
              onClick={() => {
                if (
                  verse.length === userWords.length ||
                  confirm("Are you sure!")
                )
                  setNextVerse();
              }}
            >
              {verse.length !== userWords.length ? "reload" : "next"}{" "}
            </Button>
          </div>
          {verse_key === null ? (
            <>no surah is selected</>
          ) : (
            <>
              {show && verse && (
                <>
                  <motion.div
                    key={verse_key}
                    transition={{ duration: 0.25, type: "tween" }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    layout
                  >
                    <div dir="rtl" className="md:text-3xl">
                      <Verse {...{ verse }}></Verse>
                    </div>
                  </motion.div>
                </>
              )}
              <Button
                size={"sm"}
                className="text-sm"
                disabled
                variant={"outline"}
              >
                {verse.length ? (
                  <>
                    Verse {verse_key} with length {verse.length} and{" "}
                    {penalty
                      ? (verse.length * (extraWordsPerWord + 1)) ** 2
                      : verse.length * (extraWordsPerWord + 1)}{" "}
                    score points
                  </>
                ) : (
                  <>loading...</>
                )}
              </Button>

              <div
                dir="rtl"
                className="flex flex-wrap items-center justify-center w-full gap-4"
              >
                {userWords.map((word) => {
                  return (
                    <motion.div
                      key={word.index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ duration: 0.25, type: "tween" }}
                      layout
                    >
                      <Button
                        className="md:text-3xl"
                        variant={"outline"}
                        size={"lg"}
                      >
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
              <Translations
                {...{ translations, index: verse_key }}
              ></Translations>
              <div
                dir="rtl"
                className="flex flex-wrap items-center justify-center w-full gap-4 overflow-hidden"
              >
                {words.length ? (
                  words.map((word, i) => {
                    return (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.8 }}
                        key={word.index}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.25, type: "tween" }}
                        layout
                      >
                        <Button
                          className={cn("md:text-3xl")}
                          variant={redIndex === i ? "destructive" : "outline"}
                          size={"lg"}
                          disabled={userWords.length == verse.length}
                          onClick={() => {
                            setShow(false);
                            setOpenedVerse(undefined); // close audio
                            if (
                              !(
                                verse[userWords.length].text_imlaei ==
                                  word.text_imlaei ||
                                verse[userWords.length].wordSegments
                                  .map((ws) => ws.buckwalter)
                                  .join() ==
                                  word.wordSegments
                                    .map((ws) => ws.buckwalter)
                                    .join()
                              )
                            ) {
                              setRedIndex(i);
                              setTimeout(() => {
                                setRedIndex(undefined);
                                penaltyFunc();
                              }, 150);
                            } else {
                              if (userWords.length + 1 === verse.length) {
                                setGreen(true);
                                setTimeout(() => {
                                  setGreen(false);
                                }, 1500);
                                verse_key &&
                                  addWOEProgress(+verse_key?.split(":")[0], 1);
                                addScore(
                                  penalty
                                    ? (verse.length *
                                        (extraWordsPerWord + 1)) **
                                        2
                                    : verse.length * (extraWordsPerWord + 1)
                                );
                              }
                              setUserWords((prev) => [...prev, word]);
                              setWords((prev) => {
                                return [
                                  ...prev.filter((i) => i.index != word.index),
                                ];
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
                    {userWords.length
                      ? ""
                      : Array(
                          verse.length > 0
                            ? verse.length * (extraWordsPerWord + 1)
                            : 40
                        )
                          .fill(1)
                          .map((a, i) => {
                            return (
                              <Skeleton
                                key={i}
                                className="w-[10vw] h-[48px] rounded-md"
                              />
                            );
                          })}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>{" "}
    </>
  );
}
