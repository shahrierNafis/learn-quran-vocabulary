import { Tables } from "@/database.types";
import { Word } from "@/types/types";
import getOptions from "@/utils/getOptions";
import _ from "lodash";
import { useEffect, useState } from "react";

export default function useOptions(
  wordGroups: Tables<"word_groups">[],
  sentence: Word[] | undefined
) {
  const [allOptions, setAllOptions] = useState<Word[]>([]);
  const [options, setOptions] = useState<Word[]>();
  const [preLoadedOp, setPreLoadedOp] = useState<Promise<Word[]>>();
  // set allOptions
  useEffect(() => {
    if (sentence && options?.every((el) => el)) {
      const shuffled = _.shuffle([
        ...options,
        sentence[+wordGroups[0].words[0].split(":")[2] - 1],
      ]);
      setAllOptions(shuffled);
    }

    return () => {};
  }, [options, sentence, wordGroups]);
  //set Options (once)
  useEffect(() => {
    !options && wordGroups && getOptions(wordGroups[0]).then(setOptions);
    return () => {};
  }, [options, wordGroups]);

  //set PreLoaded Options
  useEffect(() => {
    if (wordGroups.length > 1) {
      setPreLoadedOp(getOptions(wordGroups[1]));
    }

    return () => {};
  }, [options, wordGroups]);
  return { allOptions, preLoadedOp, setOptions };
}
