import fs from "fs";
import {
  List,
  WordData,
  WordCount,
  Requirements,
  WordSegment,
} from "../../src/types/types";
import path from "path";
import { descriptions } from "./descriptions";
import getOptions from "../lib/getOptions";
import { HarfRequirement } from "../lib/requirements";
import sortList from "../lib/sortList";
const wordCount: WordCount = require("../wordCount.json");
const bt = require("buckwalter-transliteration")("qac2utf");

type Data = {
  [key: string]: {
    [key: string]: {
      [key: string]: WordData;
    };
  };
};

const data: Data = require("./../data.json");
const list: List = {};

for (const s in data) {
  for (const v in data[s]) {
    for (const w in data[s][v]) {
      const word = data[s][v][w];
      for (const segIndex in word) {
        if (word[segIndex].arPartOfSpeech == "ḥarf") {
          const groupName = word[segIndex].partOfSpeech! + word[segIndex].lemma;
          const group = list[groupName] ?? {
            words: [],
            positions: [],
          };

          // add word to the groups
          const position = `${s}:${v}:${w}`;
          group.words.push({
            position,
            segIndex: segIndex,
          });
          group.getOptions = propGetHarfOptions;
          group.name =
            bt(word[segIndex].lemma) + " " + word[segIndex].partOfSpeech ?? "";
          group.description =
            bt(word[segIndex].lemma) +
            ": " +
            descriptions[word[segIndex].partOfSpeech ?? ""];
          list[groupName] = group;
        }
      }
    }
  }
}
async function propGetHarfOptions(
  position: string,
  segIndex: string,
  extraSegments?: WordSegment[]
) {
  return await getOptions(position, segIndex, HarfRequirement, extraSegments);
}
const sortedList = sortList(list);

for (const i in sortedList) {
  sortedList[i].options = await sortedList[i].getOptions(
    sortedList[i].words[0]?.position,
    sortedList[i].words[0]?.segIndex + ""
  );
  console.log(i + "/" + sortedList.length);
}

// write lists
fs.writeFile(
  "./.seed-data/harfList.json",

  JSON.stringify(sortedList),
  function (err) {
    if (err) throw err;
    console.log("complete");
  }
);
// write listCount
fs.writeFile(
  path.join(__dirname, "listCount.json"),
  JSON.stringify(
    sortedList.map((arr) => {
      return arr.positions.length;
    })
  ),
  function (err) {
    if (err) throw err;
    console.log("complete");
  }
);
