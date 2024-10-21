import { WORD } from "@/types/types";
import { cache } from "react";

async function getWord(index: `${string}:${string}:${string}`): Promise<WORD> {
  const [surahI, ayahI, wordI] = index.split(":");
  try {
    const verse = (
      await (
        await fetch(
          `https://api.quran.com/api/v4/verses/by_key/${surahI}:${ayahI}?words=true&word_fields=text_imlaei`
        )
      ).json()
    ).verse;
    const wordSegments = await (
      await fetch(`/api/get/data/${surahI}/${ayahI}/${wordI}`, {
        cache: "force-cache",
      })
    ).json();

    const {
      text_imlaei,
      translation,
      transliteration,
      position,
      char_type_name,
    } = verse.words[+wordI - 1];
    return {
      text_imlaei,
      translation,
      transliteration,
      position,
      char_type_name,
      index,
      wordSegments,
    };
  } catch (error) {
    console.log(
      `Error while fetching the data: https://api.quran.com/api/v4/verses/by_key/${surahI}:${ayahI}?words=true&word_fields=text_imlaei \n ${error}`
    );
    return getWord(index);
  }
}
export default cache(getWord);
