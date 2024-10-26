import { WORD } from "@/types/types";
import { cache } from "react";

export default cache(async function getVerseWords(
  index: `${string}:${string}`
): Promise<WORD[]> {
  const [surahI, ayahI, wordI] = index.split(":");
  try {
    const verse = (
      await (
        await fetch(
          `https://api.quran.com/api/v4/verses/by_key/${surahI}:${ayahI}?words=true&word_fields=text_imlaei`
        )
      ).json()
    ).verse;
    const verseData = await (
      await fetch(`/api/get/data/${surahI}/${ayahI}`, { cache: "force-cache" })
    ).json();
    return verse.words.map((word: WORD) => {
      const wordSegments = verseData[+word.position];
      return {
        text_imlaei: word.text_imlaei,
        translation: word.translation,
        transliteration: word.transliteration,
        position: word.position,
        char_type_name: word.char_type_name,
        audio_url: word.audio_url,
        index: (verse.verse_key +
          ":" +
          word.position) as `${string}:${string}:${string}`,
        wordSegments,
      };
    });
  } catch (error) {
    console.log(
      `Error while fetching the data: https://api.quran.com/api/v4/verses/by_key/${surahI}:${ayahI}?words=true&word_fields=text_imlaei \n ${error}`
    );
    return getVerseWords(index);
  }
});
