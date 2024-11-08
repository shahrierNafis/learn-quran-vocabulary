import { Tables } from "@/database.types";
import { usePreferenceStore } from "@/stores/preference-store";
import getVerseTranslations from "@/utils/getVerseTranslations";
import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";

function useTranslations(wordGroups: Tables<"word_groups">[]) {
  const [translations, setTranslations] =
    useState<Awaited<ReturnType<typeof getVerseTranslations>>>();
  const [preLoadedT, setPreLoadedT] =
    useState<ReturnType<typeof getVerseTranslations>>();
  const [translation_ids] = usePreferenceStore(
    useShallow((a) => [a.translation_ids])
  );

  //set translations (once)
  useEffect(() => {
    const [surah, verse] = wordGroups[0].words[0].split(":");
    if (
      translations
        ?.map((t) => t.id)
        .sort()
        .join(",") !== translation_ids.sort().join(",") &&
      wordGroups
    ) {
      getVerseTranslations(translation_ids, `${surah}:${verse}`).then(
        setTranslations
      );
    }
    return () => {};
  }, [translation_ids, translations, wordGroups]);

  //set PreLoaded translations
  useEffect(() => {
    if (wordGroups.length > 1) {
      const [surah, verse] = wordGroups[1].words[0].split(":");
      setPreLoadedT(getVerseTranslations(translation_ids, `${surah}:${verse}`));
    }
    return () => {};
  }, [translation_ids, translations, wordGroups]);

  return { translations, preLoadedT, setTranslations };
}

export default useTranslations;
