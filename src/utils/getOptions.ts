"use server";
import { OPTION, WordData } from "@/types/types";
import { Tables } from "@/database.types";

export default async function getOptions(
  wordGroup: Tables<"word_groups">
): Promise<OPTION[]> {
  const wordSegmentsArr = wordGroup.options as [WordData, WordData, WordData];
  return wordSegmentsArr.map((wordSegments, index) => ({
    wordSegments,
    index: (index + 1) as 1 | 2 | 3 | 4,
    isCorrect: false,
    wordGroupId: wordGroup.id,
  }));
}
