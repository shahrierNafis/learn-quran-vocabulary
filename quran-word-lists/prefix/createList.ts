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
import getFillPgnOptions, { FillPgn } from "../lib/getFillPgnOptions";
import getOptions from "../lib/getOptions";
import { HarfRequirement } from "../lib/requirements";
import sortList from "../lib/sortList";
const wordCount: WordCount = require("../wordCount.json");

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
      // group by prefix
      for (const segIndex in word) {
        if (word[segIndex].arPartOfSpeech == "prefix" && word[segIndex].affix) {
          const prefixGroup = list[word[segIndex].affix] ?? {
            positions: [] as string[],
            words: [],
          };
          const position = `${s}:${v}:${w}`;
          prefixGroup.positions.push(position);
          prefixGroup.words.push({
            position,
            segIndex: segIndex,
          });
          prefixGroup.getOptions = propGetHarfOptions;
          prefixGroup.name = word[segIndex].affix;
          prefixGroup.description =
            descriptions[word[segIndex].affix] ?? word[segIndex].affix;

          list[word[segIndex].affix] = prefixGroup;
        }
        if (word[segIndex].arPartOfSpeech === "fiʿil") {
          if (word[segIndex].aspect == "IMPF") {
            let prefix: FillPgn = "1S";
            let description: string = "";

            if (word[segIndex].person == 1) {
              if (word[segIndex].number == "S") {
                prefix = "1S";
                description =
                  "1st person singular pronoun prefix ا(alif) attached to an imperfect verb";
              } else if (word[segIndex].number == "P") {
                prefix = "1P";
                description =
                  "1st person plural pronoun prefix نَ(na) attached to an imperfect verb";
              }
            } else if (word[segIndex].person === 2) {
              prefix = "2nd person";
              description =
                "2nd person pronoun prefix تَ(ta) attached to an imperfect verb";
            } else if (word[segIndex].person == 3) {
              if (
                word[segIndex].gender == "F" &&
                word[segIndex].number == "S"
              ) {
                prefix = "3FS";
                description =
                  "3rd person singular feminine pronoun prefix تَ(ta) attached to an imperfect verb";
              } else {
                prefix = "3rd person";
                description =
                  "3rd person pronoun prefix یَ(ya) attached to an imperfect verb";
              }
            }
            const prefixGroup = list[prefix] ?? {
              positions: [] as string[],
              words: [],
            };
            const position = `${s}:${v}:${w}`;
            prefixGroup.positions.push(position);
            prefixGroup.words.push({
              position,
              segIndex: segIndex,
            });
            prefixGroup.name = prefix;
            prefixGroup.description = description;
            prefixGroup.getOptions = async function (
              position: string,
              segIndex: string,
              extraSegments?: WordSegment[]
            ) {
              return await getFillPgnOptions(prefix, position, +segIndex);
            };

            list[prefix] = prefixGroup;
          }
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
  const [s, v, w] = sortedList[i].words[0].position.split(":");
  const word = data[s][v][w];
  const extraSegments: WordSegment[] = word.filter((seg) => {
    if (seg.arPartOfSpeech == "prefix") return seg;
  });
  if (sortedList[i].name == "3rd person") {
    console.log();
  }
  sortedList[i].options = await sortedList[i].getOptions(
    sortedList[i].words[0]?.position,
    sortedList[i].words[0]?.segIndex + "",
    extraSegments
  );
  console.log(i + "/" + sortedList.length);
}

// write lists
fs.writeFile(
  "./.seed-data/prefixList.json",

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
