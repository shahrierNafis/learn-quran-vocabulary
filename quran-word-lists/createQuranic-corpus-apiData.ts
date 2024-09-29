import _ from "lodash";
import { CorpusApiWord, WordCount } from "./types";
import fs from "fs";

const wordCount: WordCount = require("./wordCount.json");
const data: {
  [key: string]: { [key: string]: { [key: string]: CorpusApiWord } };
} = {};

for (const surah in wordCount) {
  for (const verse in wordCount[surah]) {
    for (let position = +wordCount[surah][verse]; position != 0; --position) {
      const corpusApiWord = (await (
        await fetch(
          `http://localhost:6382/morphology/word?location=${surah}:${verse}:${position}`
        )
      ).json()) as CorpusApiWord;

      _.setWith(data, [surah, verse, position], corpusApiWord, Object);
      console.log(`${surah}:${verse}:${position}`);
    }
  }
}
// write data
fs.writeFile("corpusAPIdata.json", JSON.stringify(data), function (err) {
  if (err) throw err;
  console.log("complete");
});
