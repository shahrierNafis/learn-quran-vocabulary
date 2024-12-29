"use server";
import { OPTION, WordData } from "@/types/types";
import { Tables } from "@/database.types";
import { cyrb64 } from "../../quran-word-lists/lib/cyrb64";
const options: {
  [key: string]: [WordData, WordData, WordData];
} = require("./../options.json");

export default async function getOptions(
  wordGroup: Tables<"word_groups">
): Promise<OPTION[]> {
  const wordSegmentsArr = options[cyrb64(wordGroup.words.join("")) + ""];

  return wordSegmentsArr.map((wordSegments, index) => ({
    wordSegments,
    index: (index + 1) as 1 | 2 | 3 | 4,
    isCorrect: false,
    wordGroupId: wordGroup.id,
  }));
}
