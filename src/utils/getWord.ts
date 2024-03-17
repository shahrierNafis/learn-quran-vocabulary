import { Word } from "@/types/types";

async function getWord(index: `${string}:${string}:${string}`): Promise<Word> {
  const [surahI, ayahI, wordI] = index.split(":");
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
}
export default getWord;
