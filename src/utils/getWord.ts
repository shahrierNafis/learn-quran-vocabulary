import { Word } from "@/types/types";

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
    };
  } catch (error) {
    alert(
      `Error while fetching the data: https://api.quran.com/api/v4/verses/by_key/${surahI}:${ayahI}?words=true&word_fields=text_imlaei \n ${error}`
    );
    return getWord(index);
  }
}
export default getWord;
