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
import { useOnlineStorage } from "@/stores/onlineStorage";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Verse from "@/components/Verse";
import { useLocalStorage } from "@/stores/localStorage";
import SelectChapters from "./SelectChapters";
import wordCount from "../../wordCount.json";
import getChapterLength from "./getChapterLength";
import { createEmptyCard } from "ts-fsrs";
import { toast } from "sonner";
import MotionDiv from "@/components/MotionDiv";
const wc = wordCount as { [key: number]: { [key: number]: string } };
export default function Page() {
  useEffect(() => {
    useLocalStorage.persist.rehydrate();
    useOnlineStorage.persist.rehydrate();
  }, []);

  const [extraWordsPerWord, chapters, VFSDialogOpen, difficulty, setDifficulty] = useLocalStorage(
    useShallow((state) => [state.extraWordsPerWord, state.chapters, state.VFSDialogOpen, state.difficulty, state.setDifficulty])
  );

  const [verse_key, setVerse_key] = useState<string | null>();
  const { openedVerse, setOpenedVerse } = useVerseAudio();
  const [hold, setHold] = useState(false);

  const [verse, setVerse] = useState<WORD[]>([]); // the actual verse
  const [words, setWords] = useState<WORD[]>([]); // the actual verse + extra words
  const [userWords, setUserWords] = useState<WORD[]>([]); // user input words

  const [addARScore, addARProgress, addToWordList] = useOnlineStorage(useShallow((state) => [state.addARScore, state.addARProgress, state.addToWordList]));
  const ARProgress = useOnlineStorage(useShallow((state) => state.ARProgress));
  const [wordList] = useOnlineStorage(useShallow((a) => [a.wordList]));

  const [redIndex, setRedIndex] = useState<number>();
  const [show, setShow] = useState(false);
  const [green, setGreen] = useState(false);

  const setNextVerse = useCallback(() => {
    const nextChapter = chapters.sort((a, b) => {
      const iterationA = Math.floor(ARProgress[a] / getChapterLength(a));
      const iterationB = Math.floor(ARProgress[b] / getChapterLength(b));
      if (iterationA == iterationB) {
        return +a - +b; // put chapters with lower index first
      }
      return iterationA - iterationB; // put chapters with lower iteration first
    })[0];
    nextChapter
      ? setVerse_key(
          `${nextChapter}:${Math.trunc((ARProgress[nextChapter] % getChapterLength(nextChapter)) + 1)}` // set the next verse
        )
      : setVerse_key(null);
    setUserWords([]); // clear user input
  }, [ARProgress, chapters]);
  useEffect(() => {
    if (VFSDialogOpen) return; // if dialog is open, do not set words
    !hold && chapters.length && setNextVerse(); // set a next verse if chapters is not empty and hold is false
    return () => {};
  }, [VFSDialogOpen, chapters.length, hold, setNextVerse]);

  const reload = useCallback(
    async (signal: AbortSignal) => {
      setUserWords([]); //reset
      setWords([]);
      setVerse([]);
      if (!verse_key) return; // if verse_key is null, do not set words
      try {
        if (signal.aborted) return;

        const words: WORD[] = [];
        words.push(...(await getVerseWords(verse_key as `${string}:${string}`)).filter((word) => word.char_type_name == "word"));
        setVerse(words.filter((word) => word.char_type_name == "word"));

        if (signal.aborted) return;
        const extraWords: WORD[] = [];
        while (extraWords.length < extraWordsPerWord * words.length) {
          if (signal.aborted) return;
          console.log(words);
          const rs = Math.floor(Math.random() * Object.keys(wc).length); //random chapter
          const rv = Math.floor(Math.random() * Object.keys(wc[rs]).length); // random verse
          extraWords.push(...(await getVerseWords(`${rs}:${rv}`)).filter((word) => word.char_type_name == "word"));
        }

        if (signal.aborted) return;

        setWords(_.shuffle([...words, ...extraWords.slice(0, extraWordsPerWord * words.length)]));
      } catch (error: any) {
        // Only log non-abort errors
        if (error.name !== "AbortError") {
          console.error("Error fetching words:", error);
        }
      }
    },
    [extraWordsPerWord, verse_key]
  );

  useEffect(() => {
    // Create an AbortController for this effect instance
    const abortController = new AbortController();
    const signal = abortController.signal;
    reload(signal);
    return () => {
      abortController.abort();
    };
  }, [extraWordsPerWord, reload, verse_key]);

  function penaltyFunc() {
    if (
      userWords.length !== verse.length && // if verse is not complete
      userWords.length && // if userWords is not empty
      openedVerse !== verse_key // if audio is not playing
    ) {
      if (difficulty === 2) {
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
              const myArray = [0.5, 1, 2];
              const nextIndex = (myArray.indexOf(difficulty) + 1) % myArray.length;
              setDifficulty(myArray[nextIndex]);
            }}
          >
            difficulty: {difficulty}
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
                if (userWords.length === 0 || verse.length === userWords.length || confirm("Are you sure!"))
                  verse.length !== userWords.length && reload(new AbortController().signal); // reload
                //proceed to next verse
                setHold(false);
              }}
            >
              {verse.length && verse.length === userWords.length ? "next" : "reload"}{" "}
            </Button>
          </div>
          {verse_key === null ? (
            <>no surah is selected</>
          ) : (
            <>
              {show && verse && (
                <>
                  <MotionDiv dir="rtl" className="text-2xl md:text-3xl">
                    <Verse {...{ verse }}></Verse>
                  </MotionDiv>
                </>
              )}
              <Button size={"sm"} className="text-sm" disabled variant={"outline"}>
                {verse.length ? (
                  <>
                    Verse {verse_key} with length {verse.length} and {Math.round(getScore(verse.length, extraWordsPerWord, difficulty))} score points
                  </>
                ) : (
                  <>loading...</>
                )}
              </Button>

              <div dir="rtl" className="flex flex-wrap items-center justify-center w-full gap-4">
                {userWords.map((word) => {
                  return (
                    <MotionDiv key={word.index}>
                      <Button className="text-2xl md:text-3xl" variant={"outline"} size={"lg"}>
                        <Word
                          {...{
                            wordSegments: word.wordSegments,
                            word,
                            size: "lg",
                          }}
                        />
                      </Button>
                    </MotionDiv>
                  );
                })}
              </div>
              {/* TRANSLATION */}
              <Translations {...{ index: verse_key }}></Translations>
              <div dir="rtl" className="flex flex-wrap items-center justify-center w-full gap-4 overflow-hidden">
                {words.length ? (
                  words.map((word, i) => {
                    return (
                      <MotionDiv key={word.index}>
                        <Button
                          className={cn("text-2xl md:text-3xl")}
                          variant={redIndex === i ? "destructive" : "outline"}
                          size={"lg"}
                          disabled={userWords.length == verse.length}
                          onClick={() => {
                            difficulty > 0.5 && setShow(false); // hide verse if difficulty is high
                            setOpenedVerse(undefined); // close audio
                            if (
                              //mistake
                              !(
                                verse[userWords.length].text_imlaei == word.text_imlaei ||
                                verse[userWords.length].wordSegments.map((ws) => ws.buckwalter).join() == word.wordSegments.map((ws) => ws.buckwalter).join()
                              )
                            ) {
                              setRedIndex(i);
                              setTimeout(() => {
                                setRedIndex(undefined);
                                penaltyFunc();
                              }, 150);
                            } else {
                              if (userWords.length + 1 === verse.length) {
                                // if verse is complete
                                setGreen(true); // highlight next btn
                                setTimeout(() => {
                                  setGreen(false);
                                }, 1500);

                                setHold(true); // hold till next button is clicked

                                addNewCards(verse);

                                verse_key && addARProgress(+verse_key?.split(":")[0], 1);
                                addARScore(getScore(verse.length, extraWordsPerWord, difficulty));
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
                      </MotionDiv>
                    );
                  })
                ) : (
                  <>
                    {userWords.length
                      ? ""
                      : Array(verse.length > 0 ? verse.length * (extraWordsPerWord + 1) : 40)
                          .fill(1)
                          .map((a, i) => {
                            return <Skeleton key={i} className="w-[10vw] h-[48px] rounded-md" />;
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

  function addNewCards(verse: WORD[]) {
    let newWordAdded = 0;
    for (const word of verse) {
      if (word.char_type_name != "word") continue;
      for (const segment of word.wordSegments) {
        if (!(segment.arPartOfSpeech === "ism" || segment.arPartOfSpeech === "fiʿil")) continue; // if not a noun or verb
        if (!segment.lemma) continue;
        if (wordList[segment.lemma]) continue; // if already in wordList
        addToWordList(segment.lemma, {
          card: createEmptyCard(),
          index: word.index,
        });
        newWordAdded++;
      }
    }
    newWordAdded && toast(`${newWordAdded} new words are added to your word list.`);
  }

  function getScore(verseLength: number, extraWordsPerWord: number, difficulty: number) {
    return (verseLength * (extraWordsPerWord + 1)) ** difficulty;
  }
}
