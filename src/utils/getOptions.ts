import { Word } from "@/types/types";
import getRandomWord from "./getRandomWord";
import getWord from "./getWord";
import { Tables } from "@/database.types";

export default async function getOptions(wordGroup: Tables<"word_groups">) {
  const options: Word[] = [];
  for (const index of wordGroup.options) {
    const word = await getWord(index as `${string}:${string}:${string}`);
    options.push(word);
  }

  return options;
}
