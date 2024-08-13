import { Word } from "@/types/types";
import _ from "lodash";
import getWordImage from "./getWordImage";

async function getRandomWord(): Promise<Word> {
  const verse = await getRandomVerse();
  const {
    text_imlaei,
    translation,
    transliteration,
    position,
    char_type_name,
  } = selectRandomWord(verse);
  const index = //
    (verse.verse_key + ":" + position) as `${string}:${string}:${string}`;

  const wordImage = await getWordImage(index);
  return {
    wordImage,
    text_imlaei,
    translation,
    transliteration,
    position,
    index,
    char_type_name,
  };
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
    console.log(
      `Error while fetching the data: https://api.quran.com/api/v4/verses/random?words=true&word_fields=text_imlaei \n ${error}`
    );
    return await getRandomVerse();
  }
}
type Verse = {
  words: Word[];
  verse_key: string;
};
