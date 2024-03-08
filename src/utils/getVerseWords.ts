export type Word = {
  text: string;
  translation: string;
  transliteration: string;
  char_type_name: string;
};
export default async function getVerseWords(
  index: `${string}:${string}`
): Promise<Word[]> {
  const [surahI, ayahI] = index.split(":");
  const verse = (
    await (
      await fetch(
        `https://api.quran.com/api/v4/verses/by_key/${surahI}:${ayahI}?words=true&word_fields=text_imlaei`
      )
    ).json()
  ).verse;
  return verse.words;
}
