import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, IPreview } from "ts-fsrs";
import Word from "@/components/Word";
import { WORD } from "@/types/types";
import getWord from "@/utils/getWord";
import { Skeleton } from "@/components/ui/skeleton";
import getVerseWords from "@/utils/getVerseWords";
import Verse from "@/components/Verse";
import { useOnlineStorage } from "@/stores/onlineStorage";
import { useShallow } from "zustand/react/shallow";
import AnswerBtns from "./AnswerBtns";
import { preconfiguredFsrs } from "./getFsrs";
import Translations from "@/components/Translations";
import { motion } from "framer-motion";
import MotionDiv from "@/components/MotionDiv";
import Link from "@/components/ui/Link";
export default function StudyDialog({
  wordList,
}: {
  wordList: {
    [key: string]: {
      card: Card;
      index: string;
      isSuspended: boolean;
    };
  };
}) {
  const [verse, setVerse] = useState<WORD[]>();
  const [word, setWord] = useState<WORD | null>(null);
  const [show, setShow] = useState(false);
  const [state, setState] = useState<number | null>(null);
  const [schedulingCards, setSchedulingCards] = useState<IPreview>();
  const [now, setNow] = useState(Date.now());
  const [toggleSuspend] = useOnlineStorage(useShallow((a) => [a.toggleSuspend]));
  const [currentWordLemma, setCurrentWordLemma] = useState<string | null>(null);
  let newWords = 0;
  let learning = 0;
  let review = 0;
  let relearning = 0;
  let studiedToday = 0;

  for (const word of Object.values(wordList)) {
    if (word.isSuspended) {
      continue;
    }
    if (word.card.last_review && word.card.last_review.toDateString() === new Date().toDateString()) studiedToday++;
    switch (word.card.state) {
      case 0:
        newWords++;
        break;
      case 1:
        learning++;
        break;
      case 2:
        if (word.card.due.toDateString() === new Date().toDateString()) review++;
        break;
      case 3:
        relearning++;
        break;
    }
  }

  // main loop
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    // set Verse, Word, State and SchedulingCards
    (async () => {
      if (Object.keys(wordList).length === 0) return;

      const sortedWordList = Object.entries(wordList)
        .filter((a) => {
          if (a[1].isSuspended) return false; // skip suspended cards
          if (a[1].card.state === 0) return false; // skip new words
          if (a[1].card.due.getTime() > Date.now()) return false; // skip cards that are not due
          return true;
        })
        .sort((a, b) => {
          return a[1].card.due.getTime() - b[1].card.due.getTime();
        });
      if (sortedWordList.length === 0) {
        // if there are no cards that are due
        sortedWordList.push(
          Object.entries(wordList).filter((a) => {
            if (a[1].isSuspended) return false; // skip suspended cards
            if (a[1].card.state !== 0) return false; // skip cards that are not in new state
            return true;
          })[0]
        );
      }
      const currentWord = sortedWordList[0];
      const verseKey = currentWord[1].index as `${string}:${string}:${string}`;

      setState(currentWord[1].card.state);
      setSchedulingCards(preconfiguredFsrs.repeat(currentWord[1].card, new Date()));
      setCurrentWordLemma(currentWord[0]);

      // fetch verse and word
      const words: WORD[] = [];
      words.push(...(await getVerseWords(verseKey as `${string}:${string}`, signal)).filter((word) => word.char_type_name == "word"));
      if (signal.aborted) return;
      setVerse(words.filter((word) => word.char_type_name == "word"));
      getWord(verseKey).then(setWord);
    })();

    return () => {
      abortController.abort();
    };
  }, [wordList]);

  return (
    <>
      <Dialog>
        <DialogTrigger className="w-fit">
          <Button className="bg-blue-500 hover:bg-blue-600 rounded-full text-white">Study Now</Button>
        </DialogTrigger>
        <DialogContent className="flex flex-col max-w-full w-full h-[100vh]">
          {/* header */}
          <div className="flex flex-col h-full w-full items-center justify-center gap-8 text-2xl md:text-3xl">
            {word ? (
              <MotionDiv>
                <Word
                  {...{
                    wordSegments: word.wordSegments,
                    noWordInfo: true,
                    word,
                    size: "default",
                  }}
                />
              </MotionDiv>
            ) : state === null ? (
              <MotionDiv className="text-base text-center">
                No words are due. Go to
                <Link href="/activeRecall">
                  <Button size={"sm"} variant={"outline"}>
                    active recall page
                  </Button>
                </Link>
                to add new words to your word list.
              </MotionDiv>
            ) : (
              <Skeleton className="w-[10vw] h-[48px] rounded-md" />
            )}
            {/* Answer */}
            {show && (
              <MotionDiv className="text-2xl md:text-3xl">
                <Verse
                  {...{
                    verse,
                    highlightIndex: word ? +word.index.split(":")[2] - 1 : undefined,
                  }}
                ></Verse>
                <Translations {...{ index: `${word?.index.split(":")[0]}:${word?.index.split(":")[1]}` }}></Translations>
              </MotionDiv>
            )}
          </div>
          {/* footer */}
          <div className="flex h-fit w-full flex-col mt-auto justify-center items-center">
            {show ? ( // answer is shown
              <>
                {schedulingCards && currentWordLemma && (
                  <AnswerBtns
                    {...{
                      schedulingCards,
                      now,
                      wordLemma: currentWordLemma,
                      onClick: () => {
                        setShow(false);
                        setWord(null);
                        setVerse(undefined);
                        setState(null);
                      },
                    }}
                  />
                )}
                <MotionDiv className="flex w-fit absolute left-0 top-0 p-2 *:rounded-full gap-2">
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      setShow(false);
                      setNow(Date.now());
                    }}
                  >
                    Hide Answer
                  </Button>{" "}
                  <Button
                    variant={"destructive"}
                    onClick={() => {
                      currentWordLemma && toggleSuspend(currentWordLemma);
                    }}
                  >
                    Suspend
                  </Button>
                </MotionDiv>
              </>
            ) : (
              // answer is hidden
              <>
                <MotionDiv className="">
                  <span
                    style={{
                      textDecoration: state === 0 ? "underline" : "none",
                    }}
                    className="text-blue-500"
                  >
                    {newWords}
                  </span>
                  -
                  <span
                    style={{
                      textDecoration: state === 1 ? "underline" : "none",
                    }}
                    className="text-red-500"
                  >
                    {learning}
                  </span>
                  -
                  <span
                    style={{
                      textDecoration: state === 2 ? "underline" : "none",
                    }}
                    className="text-green-500"
                  >
                    {review}
                  </span>
                  -
                  <span
                    style={{
                      textDecoration: state === 3 ? "underline" : "none",
                    }}
                    className="text-yellow-500"
                  >
                    {relearning}
                  </span>
                </MotionDiv>
                <MotionDiv>
                  <Button
                    variant={"outline"}
                    className="rounded-full"
                    onClick={() => {
                      setShow(true);
                      setNow(Date.now());
                    }}
                  >
                    Show Answer
                  </Button>
                </MotionDiv>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
