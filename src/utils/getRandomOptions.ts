import getRandomWord from "./getRandomWord";
import getWord from "./getWord";

export default async function getOptions(
  wordGroup: `${string}:${string}:${string}`[]
) {
  const word = await getWord(wordGroup[0]);
  const arr: Word[] = [];
  while (arr.length != 3) {
    const randomWord = await getRandomWord();
    if (
      // check if the word is already in the array
      wordGroup.includes(randomWord.index) == false &&
      // check if the words spells the same
      word.transliteration !== randomWord.transliteration
    ) {
      arr.push(randomWord);
    }
  }
  return arr.map((i) => i.index as `${string}:${string}:${string}`);
}
type Word = {
  text: string;
  translation: string;
  transliteration: string;
  index: `${string}:${string}:${string}`;
};
