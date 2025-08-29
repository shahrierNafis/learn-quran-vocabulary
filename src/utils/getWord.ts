import { WORD } from "@/types/types";
import { cache } from "react";
import reportIssue from "./reportIssue";

async function getWord(index: `${string}:${string}:${string}`): Promise<WORD | null> {
  const [surahI, ayahI, wordI] = index.split(":");
  try {
    const verse = (await (await fetch(`https://api.quran.com/api/v4/verses/by_key/${surahI}:${ayahI}?words=true&word_fields=text_imlaei`)).json()).verse;
    const wordSegments = await (
      await fetch(`/api/get/data/${surahI}/${ayahI}/${wordI}`, {
        cache: "force-cache",
      })
    ).json();

    const { text_imlaei, translation, transliteration, position, audio_url, char_type_name } = verse.words[+wordI - 1];
    return {
      text_imlaei,
      translation,
      transliteration,
      position,
      audio_url,
      char_type_name,
      index,
      wordSegments,
    };
  } catch (error) {
    console.log(`Error while fetching the data: https://api.quran.com/api/v4/verses/by_key/${surahI}:${ayahI}?words=true&word_fields=text_imlaei \n ${error}`);
    if (!navigator.onLine)
      if (confirm("Failed to fetch word. Retry?")) return getWord(index);
      else reportIssue();
    return null;
  }
}
export default cache(getWord);
