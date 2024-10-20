import { Tables } from "@/database.types";
import { WORD } from "@/types/types";
import getVerseWords from "@/utils/getVerseWords";
import { useState, useEffect } from "react";

export default function useSentence(wordGroups: Tables<"word_groups">[]) {
  const [sentence, setSentence] = useState<WORD[]>();
  const [preloadedSentence, setPreloadedSentence] = useState<Promise<WORD[]>>();
  // set sentence (once)
  useEffect(() => {
    !sentence &&
      getVerseWords(wordGroups[0].words[0] as `${string}:${string}`).then(
        setSentence
      );
    return () => {};
  }, [sentence, wordGroups]);
  // set Preloaded Sentence
  useEffect(() => {
    setPreloadedSentence(
      getVerseWords(
        (wordGroups.length > 1
          ? wordGroups[1].words[0]
          : wordGroups[0].words[0]) as `${string}:${string}`
      )
    );
    return () => {};
  }, [wordGroups]);
  return { sentence, setSentence, preloadedSentence };
}
