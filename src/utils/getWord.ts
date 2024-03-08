export type Word = {
  text: string;
  translation: string;
  transliteration: string;
};
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
    text_imlaei: text,
    translation: { text: translation },
    transliteration: { text: transliteration },
  } = verse.words[+wordI - 1];

  return { text, translation, transliteration };
}
export default getWord;
