import { Tables } from "@/database.types";
import { OPTION, WORD, WordData } from "@/types/types";
import getOptions from "@/utils/getOptions";
import getWordData from "@/utils/getWordData";
import _ from "lodash";
import { cache, useEffect, useState } from "react";

export default function useOptions(
  wordGroups: Tables<"word_groups">[],
  verse: WORD[] | undefined
) {
  const [allOptions, setAllOptions] = useState<OPTION[]>([]);
  const [preLoadedOpData, setPreLoadedOpData] = useState<Promise<WordData>>();
  const [opData, setOpData] = useState<WordData>();

  const wordIndex = +wordGroups[0].words[0].split(":")[2] - 1;

  // set allOptions
  useEffect(() => {
    (async () => {
      if (opData && opData[0].position == wordGroups[0].words[0] && verse) {
        const option: OPTION = {
          index: 4,
          isCorrect: true,
          wordSegments: opData,
          wordGroupId: wordGroups[0].id,
        };
        const shuffled = _.shuffle([
          ...(await getOptions(wordGroups[0])),
          option,
        ]);
        setAllOptions(shuffled);
      } else {
        setAllOptions([])
      }
    })();

    return () => {};
  }, [opData, verse, wordGroups, wordIndex]);
  //set Option data (once)
  useEffect(() => {
    const [s, v, w] = wordGroups[0].words[0].split(":");
    if (verse)
      wordGroups && !opData && cache(getWordData)(+s, +v, +w).then(setOpData);
    return () => {};
  }, [opData, verse, wordGroups, wordIndex]);

  //set PreLoaded Option data
  useEffect(() => {
    if (wordGroups.length > 1) {
      const [s, v, w] = wordGroups[1].words[0].split(":");
      setPreLoadedOpData(cache(getWordData)(+s, +v, +w));
    }
    return () => {};
  }, [wordGroups]);
  return { allOptions, setOpData, preLoadedOpData };
}
