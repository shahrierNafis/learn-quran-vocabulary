import _ from "lodash";

async function getRandomWord() {
  const verse = await getRandomVerse();
  const {
    text_imlaei: text,
    translation: { text: translation },
    transliteration: { text: transliteration },
    position,
  } = selectRandomWord(verse);
  const index = //
    (verse.verse_key + ":" + position) as `${string}:${string}:${string}`;

  return { text, translation, transliteration, index };
}

function selectRandomWord(verse: Verse) {
  const randomWord = _.sample(verse.words);
  if (randomWord?.char_type_name !== "word") {
    return selectRandomWord(verse);
  }
  return randomWord;
}

export default getRandomWord;

async function getRandomVerse() {
  try {
    const { verse } = await (
      await fetch(
        `https://api.quran.com/api/v4/verses/random?words=true&word_fields=text_imlaei`
      )
    ).json();
    if (verse?.words == undefined || verse == undefined) {
      return await getRandomVerse();
    }
    return verse;
  } catch (error) {
    return await getRandomVerse();
  }
}
type Verse = {
  words: Word[];
  verse_key: string;
};
type Word = {
  text_imlaei: string;
  translation: { text: string };
  transliteration: { text: string };
  char_type_name: string;
  position: number;
};
