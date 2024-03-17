import React, { memo, use, useEffect, useState } from "react";
import { Button } from "./ui/button";
import getVerseWords from "@/utils/getVerseWords";
import { useLocalStorage } from "@uidotdev/usehooks";
import getVerseTranslation from "@/utils/getVerseTranslation";
import _ from "lodash";
import { cn } from "@/lib/utils";
import LoadingScreen from "./ui/LoadingScreen";
import SimilarWordsTable from "./SimilarWordsTable";
import { Database, Tables } from "@/database.types";
import { Word } from "@/types/types";
import { createClient } from "@/utils/supabase/clients";
import getIntervals from "@/utils/getIntervals";
import getOptions from "@/utils/getOptions";
import McqNav from "./McqNav";

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
  const [sentence, setSentence] = useState<Word[]>();
  const [translation, setTranslation] = useState<string>();
  const [allOptions, setAllOptions] = useState<Word[]>([]);
  const [correct, setCorrect] = useState<boolean>();
  const [selected, setSelected] = useState<`${string}:${string}:${string}`>();
  const [showSimilarWords, setShowSimilarWords] = useState<boolean>(false);
  const supabase = createClient<Database>();
  const [intervals, setIntervals] = useState<Intervals>();
  const [options, setOptions] = useState<Word[]>();
  const [preLoadedOp, setPreLoadedOp] = useState<Promise<Word[]>>();
  const [showTranslation] = useLocalStorage<boolean>("showTranslation", true);
  const [showTransliteration] = useLocalStorage<boolean>(
    "showTransliteration",
    true
  );
  const [translation_id] = useLocalStorage<number>("translation_id", 20);

  //set Options (once)
  useEffect(() => {
    !options && wordGroups && getOptions(wordGroups[0]).then(setOptions);
    return () => {};
  }, [options, wordGroups]);

  //set PreLoaded Options
  useEffect(() => {
    setPreLoadedOp(
      getOptions(wordGroups.length > 1 ? wordGroups[1] : wordGroups[0])
    );
    return () => {};
  }, [options, wordGroups]);
  // set Intervals
  useEffect(() => {
    getIntervals().then(setIntervals);
    return () => {};
  }, []);
  // set sentence
  useEffect(() => {
    getVerseWords(wordGroups[0].words[0] as `${string}:${string}`).then(
      setSentence
    );
    return () => {};
  }, [wordGroups]);
  // set translation
  useEffect(() => {
    const [surah, verse] = wordGroups[0].words[0].split(":");
    getVerseTranslation(translation_id, `${surah}:${verse}`).then(
      setTranslation
    );
    return () => {};
  }, [translation_id, wordGroups]);
  const [surah, verse] = wordGroups[0].words[0].split(":");
  wordGroups[0].words[0];

  // set allOptions
  useEffect(() => {
    if (sentence && options) {
      const shuffled = _.shuffle([
        ...options,
        sentence[+wordGroups[0].words[0].split(":")[2] - 1],
      ]);

      setAllOptions(shuffled);
    }

    return () => {};
  }, [options, sentence, wordGroups]);

  async function onClick(index: `${string}:${string}:${string}`) {
    const correct = wordGroups[0].words[0] === index;
    setCorrect(correct);
    setSelected(index);

    let percentage: number;
    const word_group_id = wordGroups[0].id;
    // if correct increase progress
    if (correct) {
      const currentProgress = await supabase
        .from("user_progress")
        .select("progress")
        .eq("word_group_id", word_group_id)
        .then(({ data, error }) => {
          if (error) {
            console.log(error);
          } else {
            return data[0] ? data[0].progress : 0;
          }
        });
      percentage = getNextProgress(intervals!, currentProgress);
    } else {
      // else set progress to 0
      percentage = 0;
    }

    await supabase.from("user_progress").upsert({
      word_group_id,
      progress: percentage,
      updated_at: new Date().toISOString(),
    });
  }
  async function nextClick() {
    callback(correct ?? false);
    setCorrect(undefined);
    setSelected(undefined);
    setShowSimilarWords(false);
    setOptions(await preLoadedOp);
  }
  if (!intervals) {
    return <LoadingScreen />;
  }
  return (
    <>
      {/* Nav */}
      <McqNav leftToGo={correct ? wordGroups.length - 1 : wordGroups.length} />
      <div className="grid place-items-center grow">
        <div className="flex flex-col m-4 gap-4 justify-center items-center my-auto">
          <div className="opacity-50 text-sm inline-block">{`${surah}:${verse}`}</div>
          {/* ARABIC */}
          <div
            dir="rtl"
            className="text-3xl flex justify-between items-center gap-2 flex-wrap "
          >
            {sentence?.map((word, index) => {
              if (word.char_type_name !== "word") return "";
              if (
                index == +wordGroups[0].words[0].split(":")[2] - 1 &&
                !selected
              )
                return <>{"{{ _._._._ }}"}</>;
              return (
                <>
                  <div className="flex flex-col">
                    <div
                      className={cn(
                        index == +wordGroups[0].words[0].split(":")[2] - 1 &&
                          "text-green-500"
                      )}
                    >
                      {word.text_imlaei}
                    </div>
                    <div className="">
                      {showTransliteration && (
                        <div className="text-green-100 text-sm">
                          {word.transliteration.text}
                        </div>
                      )}
                      {showTranslation && (
                        <div className="text-red-100 text-xs">
                          {word.translation.text}{" "}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              );
            })}
          </div>
          {/* TRANSLATION */}
          <div className="text-xl text-center">
            {translation?.replaceAll(/<sup.*>.*<\/sup>/g, "")}
          </div>
          <div>
            {/* NEXT BTN */}
            {selected && (
              <Button className="mx-auto block my-4" onClick={nextClick}>
                Next
              </Button>
            )}
            {/* OPTIONS */}
            <div className="grid grid-cols-2 gap-8">
              {allOptions.length == 4 ? (
                allOptions.map(({ index, text_imlaei }) => {
                  return (
                    <Button
                      disabled={selected && true}
                      className={cn(
                        "text-3xl h-full px-8 py-6", //
                        selected &&
                          (wordGroups[0].words[0] === index
                            ? "bg-green-500 text-white"
                            : "bg-gray-500 text-white"),
                        selected === index &&
                          (index === wordGroups[0].words[0]
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
                  <LoadingScreen />
                </>
              )}
            </div>
          </div>
          {/* show similar words */}
          {selected && (
            <Button
              className="mx-auto block my-4"
              onClick={() => setShowSimilarWords(!showSimilarWords)}
            >
              {showSimilarWords ? "Hide" : "Show"} similar words
            </Button>
          )}
        </div>
        {/* similar words table */}
        {selected && showSimilarWords && (
          <SimilarWordsTable
            {...{
              wordGroup: wordGroups[0],
              translation_id,
            }}
          />
        )}
      </div>
    </>
  );
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
