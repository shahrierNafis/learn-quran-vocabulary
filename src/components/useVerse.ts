import { Tables } from "@/database.types";
import { WORD } from "@/types/types";
import getVerseWords from "@/utils/getVerseWords";
import { useState, useEffect } from "react";

export default function useVerse(wordGroups: Tables<"word_groups">[]) {
  const [verse, setVerse] = useState<WORD[]>();
  const [preloadedVerse, setPreloadedVerse] = useState<Promise<WORD[]>>();
  // set verse (once)
  useEffect(() => {
    !verse &&
      getVerseWords(wordGroups[0].words[0] as `${string}:${string}`).then(
        setVerse
      );
    return () => {};
  }, [verse, wordGroups]);
  // set Preloaded Verse
  useEffect(() => {
    setPreloadedVerse(
      getVerseWords(
        (wordGroups.length > 1
          ? wordGroups[1].words[0]
          : wordGroups[0].words[0]) as `${string}:${string}`
      )
    );
    return () => {};
  }, [wordGroups]);
  return { verse, setVerse, preloadedVerse };
}
