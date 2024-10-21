import { Tables } from "@/database.types";
import { OPTION, WORD } from "@/types/types";
import getOptions from "@/utils/getOptions";
import getWordData from "@/utils/getWordData";
import _ from "lodash";
import { cache, useEffect, useState } from "react";

export default function useOptions(
  wordGroups: Tables<"word_groups">[],
  sentence: WORD[] | undefined
) {
  const [allOptions, setAllOptions] = useState<OPTION[]>([]);
  const [options, setOptions] = useState<OPTION[]>();
  const [preLoadedOp, setPreLoadedOp] = useState<Promise<OPTION[]>>();
  const wordIndex = +wordGroups[0].words[0].split(":")[2] - 1;
  const [s, v, w] = wordGroups[0].words[0].split(":");
  // set allOptions
  useEffect(() => {
    (async () => {
      if (sentence && options && options[0].wordGroupId == wordGroups[0].id) {
        const option: OPTION = {
          index: 4,
          isCorrect: true,
          wordSegments: await cache(getWordData)(+s, +v, +w),
          wordGroupId: wordGroups[0].id,
        };
        const shuffled = _.shuffle([...options, option]);
        setAllOptions(shuffled);
      }
    })();

    return () => {};
  }, [options, s, sentence, v, w, wordGroups, wordIndex]);
  //set Options (once)
  useEffect(() => {
    if (sentence)
      !options &&
        wordGroups &&
        getOptions(wordGroups[0]).then((op) => setOptions(op));
    return () => {};
  }, [options, sentence, wordGroups, wordIndex]);

  //set PreLoaded Options
  useEffect(() => {
    if (wordGroups.length > 1) {
      setPreLoadedOp(getOptions(wordGroups[1]));
    }
    return () => {};
  }, [wordGroups]);
  return { allOptions, preLoadedOp, setOptions };
}
