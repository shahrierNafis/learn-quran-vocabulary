import React, { use, useEffect, useState } from "react";
import { Button } from "./ui/button";
import getVerseWords, { Word } from "@/utils/getVerseWords";
import getVerseTranslation from "@/utils/getVerseTranslation";
import _ from "lodash";
import getWord from "@/utils/getWord";
import { cn } from "@/lib/utils";
import LoadingScreen from "./ui/LoadingScreen";
import SimilarWordsTable from "./SimilarWordsTable";

export default function MCQ({
  wordGroup,
  options,
  callback,
  translation_id,
}: {
  wordGroup: `${string}:${string}:${string}`[];
  options: `${string}:${string}:${string}`[];
  callback: (bool: boolean) => void;
  translation_id: number;
}) {
  const [sentence, setSentence] = useState<Word[]>([]);
  const [translation, setTranslation] = useState<string>();
  const [allOptions, setAllOptions] = useState<
    { index: `${string}:${string}:${string}`; text: string }[]
  >([]);
  const [correct, setCorrect] = useState<boolean>();
  const [selected, setSelected] = useState<`${string}:${string}:${string}`>();
  const [showSimilarWords, setShowSimilarWords] = useState<boolean>(false);
  // set sentence
  useEffect(() => {
    getVerseWords(wordGroup[0]).then(setSentence);
    return () => {};
  }, [wordGroup]);
  // set translation
  useEffect(() => {
    const [surah, verse] = wordGroup[0].split(":");
    getVerseTranslation(translation_id, `${surah}:${verse}`).then(
      setTranslation
    );
    return () => {};
  }, [translation_id, wordGroup]);
  const [surah, verse] = wordGroup[0].split(":");
  wordGroup[0];

  // set allOptions
  useEffect(() => {
    let shouldSkip = false;
    if (shouldSkip) return;
    const shuffled = _.shuffle([...options, wordGroup[0]]);
    Promise.all([
      ...shuffled.map(async (option, index) => {
        const { text } = await getWord(option);
        return {
          index: option,
          text,
        };
      }),
    ]).then(setAllOptions);
    return () => {
      shouldSkip = true;
    };
  }, [options, wordGroup]);

  function onClick(index: `${string}:${string}:${string}`) {
    setCorrect(wordGroup[0] === index);
    setSelected(index);
  }
  function nextClick() {
    callback(correct ?? false);
    setCorrect(undefined);
    setSelected(undefined);
    setShowSimilarWords(false);
  }
  return (
    <>
      <div className="flex flex-col gap-4 justify-center items-center h-screen">
        <div className="opacity-50 text-sm inline-block">{`${surah}:${verse}`}</div>
        {/* ARABIC */}
        <div className="text-3xl text-center">
          {sentence.map((word, index) => {
            if (word.char_type_name !== "word") return "";
            if (index == +wordGroup[0].split(":")[2] - 1)
              return <> ( _ _ _ _ _ ) </>;
            return <> {word.text} </>;
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
              allOptions.map(({ index, text }) => {
                return (
                  <Button
                    disabled={selected && true}
                    className={cn(
                      "text-3xl h-full px-8 py-6", //
                      selected &&
                        (wordGroup[0] === index
                          ? "bg-green-500 text-white"
                          : "bg-gray-500 text-white"),
                      selected === index &&
                        (index === wordGroup[0]
                          ? "ring-4 ring-white"
                          : "ring-4 ring-red-500")
                    )}
                    key={index}
                    onClick={() => onClick(index)}
                  >
                    {text}
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
        {selected && (
          <Button
            className="mx-auto block my-4"
            onClick={() => setShowSimilarWords(!showSimilarWords)}
          >
            {showSimilarWords ? "Hide" : "Show"} similar words
          </Button>
        )}
        {selected && showSimilarWords && (
          <SimilarWordsTable {...{ wordGroup, translation_id }} />
        )}
      </div>
    </>
  );
}
