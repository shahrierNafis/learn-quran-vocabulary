import { Word } from "@/types/types";
import getWordImage from "./getWordImage";

async function getWord(index: `${string}:${string}:${string}`): Promise<Word> {
  const [surahI, ayahI, wordI] = index.split(":");
  try {
    const verse = (
      await (
        await fetch(
          `https://api.quran.com/api/v4/verses/by_key/${surahI}:${ayahI}?words=true&word_fields=text_imlaei`
        )
      ).json()
    ).verse;
    const wordImage = await getWordImage(index);

    const {
      text_imlaei,
      translation,
      transliteration,
      position,
      char_type_name,
    } = verse.words[+wordI - 1];
    return {
      wordImage,
      text_imlaei,
      translation,
      transliteration,
      position,
      char_type_name,
      index,
    };
  } catch (error) {
    console.log(
      `Error while fetching the data: https://api.quran.com/api/v4/verses/by_key/${surahI}:${ayahI}?words=true&word_fields=text_imlaei \n ${error}`
    );
    return getWord(index);
  }
}
export default getWord;
