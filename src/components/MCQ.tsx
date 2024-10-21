import React, { memo, use, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Database, Tables } from "@/database.types";
import _ from "lodash";
import LoadingScreen from "./ui/LoadingScreen";
import SimilarWordsTable from "./SimilarWordsTable";
import Sentence from "./Sentence";
import McqProgress from "./McqProgress";
import { createClient } from "@/utils/supabase/clients";
import useSentence from "./useSentence";
import useOptions from "./useOptions";
import useProgress from "./useProgress";
import getIntervals from "@/utils/getIntervals";
import Options from "./Options";
import Translations from "./Translations";
import useTranslations from "./useTranslations";
import { usePreferenceStore } from "@/stores/preference-store";
import { useShallow } from "zustand/react/shallow";
type Intervals = {
  [key: number]: number;
};
function MCQ({
  wordGroups,
  callback,
}: {
  wordGroups: Tables<"word_groups">[];
  callback: (bool: boolean) => void;
}) {
  const supabase = createClient<Database>();
  const { sentence, setSentence, preloadedSentence } = useSentence(wordGroups);

  const { translations, setTranslations, preLoadedT } =
    useTranslations(wordGroups);

  const [showSimilarWords, setShowSimilarWords] = useState<boolean>(false);
  const [correct, setCorrect] = useState<boolean>(false);
  const [selected, setSelected] = useState<1 | 2 | 3 | 4>();
  const [intervals, setIntervals] = useState<Intervals>();

  const [translation_ids] = usePreferenceStore(
    useShallow((a) => [a.translation_ids])
  );
  useEffect(() => {
    usePreferenceStore.persist.rehydrate();
  }, []);
  const { allOptions, preLoadedOp, setOptions } = useOptions(
    wordGroups,
    sentence
  );
  const { currentProgress, setCurrentProgress } = useProgress(wordGroups[0].id);
  // set Intervals
  useEffect(() => {
    getIntervals().then(setIntervals);
    return () => {};
  }, []);
  const [surah, verse] = wordGroups[0].words[0].split(":");

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
        <McqProgress
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
          <div className="opacity-50 text-sm inline-block">{`${surah}:${verse}`}</div>
          {/* ARABIC */}
          <div
            dir="rtl"
            className="text-3xl flex justify-between items-center gap-2 flex-wrap "
          >
            <Sentence
              {...{
                selected,
                sentence,
                correct,
                correctIndex: +wordGroups[0].words[0].split(":")[2] - 1,
              }}
            />
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
            )}
            {/* OPTIONS */}
            <Options
              {...{
                allOptions,
                correct,
                currentWord: wordGroups[0].words[0],
                selected,
                onClick,
              }}
            ></Options>
          </div>
          {/* show similar words */}
          {(correct || selected) && (
            <Button
              className="mx-auto block my-4"
              onClick={() => setShowSimilarWords(!showSimilarWords)}
            >
              {showSimilarWords ? "Hide" : "Show"} similar words
            </Button>
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
  async function onClick(isCorrect: boolean, index: 1 | 2 | 3 | 4) {
    setCorrect(isCorrect);
    setSelected(index);

    let newProgress: number;
    const word_group_id = wordGroups[0].id;
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
    callback(correct ?? false);
    setCorrect(false);
    setSelected(undefined);
    setShowSimilarWords(false);
    setSentence(await preloadedSentence);
    setOptions(await preLoadedOp);
    setTranslations(await preLoadedT);
  }
}

export default memo(MCQ, (prev, next) => {
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
