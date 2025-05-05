import { WordCount } from "@/types/types";
import fs from "fs";
const wordCount: WordCount = require("./wordCount.json");
const inverseWordCount: { [key: number]: string[] } = {};
for (const surah in wordCount) {
  for (const verse in wordCount[surah]) {
    inverseWordCount[+wordCount[surah][verse]] = [
      ...(inverseWordCount[+wordCount[surah][verse]] ?? []),
      `${surah}:${verse}`,
    ];
  }
}
for (const count in inverseWordCount) {
  console.log(`${count}: ${inverseWordCount[count].length}`);
}
// write data
fs.writeFile(
  "./quran-word-lists/inverseWordCount.json",
  JSON.stringify(inverseWordCount),
  function (err) {
    if (err) throw err;
    console.log("complete");
  }
);
fs.writeFile(
  "./src/inverseWordCount.json",
  JSON.stringify(inverseWordCount),
  function (err) {
    if (err) throw err;
    console.log("complete");
  }
);
