import { Word } from "@/types/types";

export default async function getVerseWords(
  index: `${string}:${string}`
): Promise<Word[]> {
  const [surahI, ayahI] = index.split(":");
  try {
    const verse = (
      await (
        await fetch(
          `https://api.quran.com/api/v4/verses/by_key/${surahI}:${ayahI}?words=true&word_fields=text_imlaei`
        )
      ).json()
    ).verse;
    return verse.words.map((word: Word) => {
      return {
        text_imlaei: word.text_imlaei,
        translation: word.translation,
        transliteration: word.transliteration,
        position: word.position,
        char_type_name: word.char_type_name,
        index: (verse.verse_key +
          ":" +
          word.position) as `${string}:${string}:${string}`,
      };
    });
  } catch (error) {
    console.log(
      `Error while fetching the data: https://api.quran.com/api/v4/verses/by_key/${surahI}:${ayahI}?words=true&word_fields=text_imlaei \n ${error}`
    );
    return getVerseWords(index);
  }
}
