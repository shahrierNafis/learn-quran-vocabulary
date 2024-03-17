import { Word } from "@/types/types";
import getRandomWord from "./getRandomWord";
import getWord from "./getWord";
import { Tables } from "@/database.types";

export default async function getOptions(wordGroup: Tables<"word_groups">) {
  const word = await getWord(
    wordGroup.words[0] as `${string}:${string}:${string}`
  );
  const options: Word[] = [];
  while (options.length != 3) {
    const randomWord = await getRandomWord();
    if (
      // check if the word is already in the option
      wordGroup.words.includes(randomWord.index) == false &&
      // check if the words spells the same
      word.transliteration.text !== randomWord.transliteration.text
    ) {
      options.push(randomWord);
    }
  }
  return options;
}
