import { List, WordCount } from "../../src/types/types";
const wordCount: WordCount = require("../wordCount.json");

export default function sortList(list: List) {
  return Object.values(list)
    .map((wordGroup) => {
      wordGroup.words = wordGroup.words.sort((wordA, wordB) => {
        const [surahA, verseA] = wordA.position.split(":");
        const [surahB, verseB] = wordB.position.split(":");
        return +wordCount[surahA][verseA] - +wordCount[surahB][verseB];
      });
      wordGroup.positions = wordGroup.words.map((w) => w.position);
      return wordGroup;
    })
    .sort((wordGroupA, wordGroupB) => {
      return wordGroupB.words.length - wordGroupA.words.length;
    });
}
