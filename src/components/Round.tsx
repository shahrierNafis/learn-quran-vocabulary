import React, { memo, use, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Database, Tables } from "@/database.types";
import _ from "lodash";
import LoadingScreen from "./ui/LoadingScreen";
import SimilarWordsTable from "./SimilarWordsTable";
import Verse from "./Verse";
import RoundProgress from "./RoundProgress";
import { createClient } from "@/utils/supabase/clients";
import useVerse from "./useVerse";
import useOptions from "./useOptions";
import useProgress from "./useProgress";
import Options from "./Options";
import Translations from "./Translations";
import useTranslations from "./useTranslations";
import { useOnlineStorage } from "@/stores/onlineStorage";
import { useShallow } from "zustand/react/shallow";
import Link from "next/link";
import WordInfo from "./WordInfo";
import TextInput, { simplifyArabic } from "./TextInput";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import VerseAudioBtn from "./verseAudioBtn";
import useVerseAudio from "./useVerseAudio";
function Round({
  wordGroups,
  callback,
  noNewWord,
  textInput, listen,

}: {
  wordGroups: Tables<"word_groups">[];
  callback: (bool: boolean) => void;
  noNewWord?: boolean;
  textInput?: boolean; listen?: boolean;

}) {
  const supabase = createClient<Database>();
  const { verse, setVerse, preloadedVerse } = useVerse(wordGroups);

  const { translations, setTranslations, preLoadedT } =
    useTranslations(wordGroups);

  const [showSimilarWords, setShowSimilarWords] = useState<boolean>(false);
  const [correct, setCorrect] = useState<boolean>(false);
  const [selected, setSelected] = useState<1 | 2 | 3 | 4>();
  const intervals = useOnlineStorage(useShallow((state) => state.intervals));
  const { setOpenedVerse } = useVerseAudio();

  const [translation_ids] = useOnlineStorage(
    useShallow((a) => [a.translation_ids])
  );
  useEffect(() => {
    useOnlineStorage.persist.rehydrate();
  }, []);
  const { allOptions, setOpData, preLoadedOpData } = useOptions(
    wordGroups,
    verse
  );
  const { currentProgress, setCurrentProgress } = useProgress(wordGroups[0].id);
  // set Intervals
  const [surahI, verseI] = wordGroups[0].words[0].split(":");
  const [text, setText] = useState("");
  const [switch2MC, setSwitch2MC] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  if (!intervals) {
    return <LoadingScreen />;
  }
  return (
    <>
      <div className="flex mx-auto">
        {/* Nav */}
        <Button variant={"outline"} disabled>
          {correct ? wordGroups.length - 1 : wordGroups.length} more to go ⇒
        </Button>
        {/* Progress */}
        <RoundProgress
          {...{
            word_group: wordGroups[0],
            setCorrect,
            setSelected,
            currentProgress,
            setCurrentProgress,
          }}
        />
      </div>
      <div className="mx-auto my-4 grow">
        <div className="flex flex-col m-4 gap-4 justify-center items-center my-auto">
          <div className="opacity-50 text-sm inline-block">{`${surahI}:${verseI}`}</div>
          {/* ARABIC */}
          <div
            dir="rtl"
            className="text-3xl flex  items-center gap-2 flex-wrap "
          >
            <Verse
              {...{
                hideIndex:
                  !selected && !correct
                    ? +wordGroups[0].words[0].split(":")[2] - 1
                    : undefined,
                switchIndex:
                  selected || correct
                    ? +wordGroups[0].words[0].split(":")[2] - 1
                    : undefined,
                highlightIndex:
                  selected || correct
                    ? +wordGroups[0].words[0].split(":")[2] - 1
                    : undefined,
                verse,
                hideAudioPlayer: !(selected || correct),
              }}
            >
              {textInput && verse && (
                <>
                  <TextInput
                    {...{
                      text,
                      setText,
                      word: verse[+wordGroups[0].words[0].split(":")[2] - 1],
                      isValid: () => {
                        setCorrect(true);
                        setText("");
                        onClick(true, undefined, wordGroups[0].id);
                      },
                    }}
                  />
                </>
              )}
            </Verse>
          </div>
          {/* TRANSLATION */}{" "}
          <Translations
            {...{ translations, index: wordGroups[0].words[0] }}
          ></Translations>
          <div>
            {/* NEXT BTN */}
            {(correct || selected) && (
              <Button className="mx-auto block my-4" onClick={nextClick}>
                Next
              </Button>
            )}{" "}
            {/* New Word? */}
            {!noNewWord &&
              !(correct || selected) &&
              verse &&
              verse[+wordGroups[0].words[0].split(":")[2] - 1] && (
                <>
                  <div className="flex justify-center mx-auto  my-4">
                    <WordInfo
                      {...{
                        // variant: "outline",
                        size: "sm",
                        wordSegments:
                          verse[+wordGroups[0].words[0].split(":")[2] - 1]
                            .wordSegments,
                        word: verse[+wordGroups[0].words[0].split(":")[2] - 1],
                      }}
                    >
                      <Button
                        variant={"destructive"}
                        onClick={() => setCurrentProgress(0)}
                      >
                        <div className=""> {"Don't Know"}</div>
                      </Button>
                    </WordInfo>
                    <VerseAudioBtn onClick={() => { if (!listen) setCurrentProgress(0) }} variant={listen ? "default" : "destructive"} verse_key={`${+wordGroups[0].words[0].split(":")[0]}:${+wordGroups[0].words[0].split(":")[1]}`} />
                  </div>{" "}
                </>
              )}
            {textInput && !correct && (
              <>
                {!switch2MC && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          variant={"outline"}
                          onClick={() => setSwitch2MC(true)}
                        >
                          MC
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Switch to multiple choice</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {!hintUsed && verse && (
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      setText(
                        text.trim() +
                        simplifyArabic(
                          verse[
                            +wordGroups[0].words[0].split(":")[2] - 1
                          ].wordSegments
                            .map((w) => w.arabic)
                            .join("")
                        ).replace(text, "")[0]
                      );
                      setHintUsed(true);
                    }}
                  >
                    hint!
                  </Button>
                )}
              </>
            )}
            {/* OPTIONS */}
            {!(textInput && !switch2MC) && (
              <Options
                {...{
                  allOptions,
                  correct,
                  currentWord: wordGroups[0].words[0],
                  selected,
                  onClick,
                }}
              ></Options>
            )}
          </div>
          {/* show similar words */}
          {(correct || selected) && (
            <>
              <div className="flex items-center justify-center">
                <Button
                  variant={"outline"}
                  className="mx-auto block my-4"
                  onClick={() => setShowSimilarWords(!showSimilarWords)}
                >
                  {showSimilarWords ? "Hide" : "Show"} similar words
                </Button>{" "}
                <Link target="_blank" href={"/wordGroup/" + wordGroups[0].id}>
                  <Button variant={"outline"}>Go To WordGroup</Button>
                </Link>
              </div>
            </>
          )}
        </div>
        {/* similar words table */}
        {(correct || selected) && showSimilarWords && (
          <>
            <div className="text-center text-3xl">{wordGroups[0].name}</div>
            <div className={`${!wordGroups[0].name && "text-center text-3xl"}`}>
              {wordGroups[0].description}
            </div>
            <SimilarWordsTable
              {...{
                wordGroup: {
                  ...wordGroups[0],
                  words: wordGroups[0].words.slice(1),
                },
                translation_ids,
              }}
            />
          </>
        )}
      </div>
    </>
  );
  async function onClick(
    isCorrect: boolean,
    index: 1 | 2 | 3 | 4 | undefined,
    word_group_id: number
  ) {

    setOpenedVerse(undefined)

    setCorrect(isCorrect);
    setSelected(index);

    let newProgress: number;
    // if correct increase progress
    if (isCorrect) {
      newProgress = getNextProgress(intervals!, currentProgress);
    } else {
      // else set progress to 0
      newProgress = 0;
    }
    setCurrentProgress(newProgress);
    await supabase.from("user_progress").upsert({
      word_group_id,
      progress: newProgress,
      updated_at: new Date().toISOString(),
    });
  }
  async function nextClick() {
    setSwitch2MC(false);
    setHintUsed(false);
    setText("");
    callback(correct ?? false);
    setCorrect(false);
    setSelected(undefined);
    setShowSimilarWords(false);
    setOpenedVerse(undefined)

    setOpData(undefined);
    setVerse(undefined);
    setTranslations(undefined);

    setOpData(await preLoadedOpData);
    setVerse(await preloadedVerse);
    setTranslations(await preLoadedT);
  }
}

export default memo(Round, (prev, next) => {
  return prev.wordGroups.every((currentValue, index) => {
    if (next.wordGroups[index] == undefined) return false;
    return currentValue.id == next.wordGroups[index].id;
  });
});

function getNextProgress(
  interval: { [key: number]: number },
  currentProgress?: number
) {
  const steps = Object.keys(interval).sort((a, b) => +a - +b);
  for (const step of steps) {
    if (+step > (currentProgress ?? 0)) {
      return +step;
    }
  }
  return (currentProgress ?? 0) + 25;
}
