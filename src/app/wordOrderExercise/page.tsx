"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import VerseLengths from "./VerseLengths";
import ExtraWords from "./ExtraWords";
import Score from "./Score";
import _ from "lodash";
import getVersesWithLength from "./getVersesWithLegnth";
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

export default function Page() {
  useEffect(() => {
    useLocalStorage.persist.rehydrate();
  }, []);

  const [
    setVerse_key,
    verse_key,
    extra,
    addScore,
    verseLengths,
    VLDialogOpen,
    penalty,
    setPenalty,
  ] = useLocalStorage(
    useShallow((state) => [
      state.setVerse_key,
      state.verse_key,
      state.extra,
      state.addScore,
      state.verseLengths,
      state.VLDialogOpen,
      state.penalty,
      state.setPenalty,
    ])
  );

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
  const setRandomVerse = useCallback(() => {
    // set a random verse
    getVersesWithLength(_.shuffle(verseLengths)[0]).then((a) => {
      setVerse_key(_.shuffle(a)[0]);
      setVerse([]);
    });
  }, [setVerse_key, verseLengths]);
  useEffect(() => {
    !verse_key && setRandomVerse(); // set a random verse if verse_key is null
    return () => {};
  }, [setRandomVerse, verse_key]);

  useEffect(() => {
    // set Words
    if (VLDialogOpen) return; // if dialog is open, do not set words
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
        while (extraWords.length < extra * words.length) {
          if (signal.aborted) return;
          console.log(words);
          const verse = _.shuffle(await getVersesWithLength(verseLengths[0]));
          extraWords.push(
            ...(await getVerseWords(verse[0] as `${string}:${string}`)).filter(
              (word) => word.char_type_name == "word"
            )
          );
        }

        if (signal.aborted) return;

        setWords(
          _.shuffle([...words, ...extraWords.slice(0, extra * words.length)])
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
      <div className="flex items-end justify-center w-full gap-4 my-4">
        <VerseLengths />
        <ExtraWords />
        <Score />
        <Button
          variant={"outline"}
          onClick={() => {
            setPenalty(!penalty);
          }}
        >
          {penalty ? "penalty:on" : "penalty:off"}
        </Button>
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
          {/* new Btn */}
          <Button
            className={cn(`${green && "ring ring-green-400"}`)}
            variant={"outline"}
            onClick={() => {
              if (verse.length !== userWords.length) confirm("Are you sure!");
              setRandomVerse();
            }}
          >
            {verse.length !== userWords.length ? "new" : "next"}{" "}
          </Button>
        </div>
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
              <div dir="rtl" className="text-3xl">
                <Verse {...{ verse }}></Verse>
              </div>
            </motion.div>
          </>
        )}
        <Button size={"sm"} className="text-sm" disabled variant={"outline"}>
          {verse.length ? (
            <>
              Verse {verse_key} with length {verse.length}
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
                    className={cn("text-3xl")}
                    variant={redIndex === i ? "destructive" : "outline"}
                    size={"lg"}
                    disabled={userWords.length == verse.length}
                    onClick={() => {
                      setShow(false);
                      setOpenedVerse(undefined); // close audio
                      if (
                        verse[userWords.length].text_imlaei != word.text_imlaei
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

                          addScore(
                            (penalty
                              ? verse.length * verse.length
                              : verse.length) +
                              verse.length * extra
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
