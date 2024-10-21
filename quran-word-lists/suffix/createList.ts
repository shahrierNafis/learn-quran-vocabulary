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
import getWordData from "../../src/utils/getWordData";
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
      for (const segIndex in word) {
        if (word[segIndex].arPartOfSpeech == "suffix") {
          // group by word[segIndex].affix prefix
          const SuffixGroupName = getSuffixGroupName(word, +segIndex);
          const suffixGroup = list[SuffixGroupName] ?? {
            positions: [] as string[],
            words: [],
          };
          const position = `${s}:${v}:${w}`;
          suffixGroup.positions.push(position);
          suffixGroup.words.push({
            position,
            segIndex: segIndex,
          });
          suffixGroup.name = SuffixGroupName;
          suffixGroup.description =
            getDescription(word, +segIndex) ?? word[segIndex].affix;
          suffixGroup.spellings?.add(word[segIndex].arabic);
          if (["OBJ", "SUBJ", "OBJ2"].includes(word[segIndex].partOfSpeech)) {
            suffixGroup.getOptions = propGetOptions;
          } else {
            suffixGroup.getOptions = propGetHarfOptions;
          }
          list[SuffixGroupName] = suffixGroup;
        }
      }
    }
  }
}
async function propGetOptions(
  position: string,
  segIndex: string,
  extraSegments?: WordSegment[]
) {
  const requirements: Requirements = [
    {
      shouldMatch: ["partOfSpeech", "arPartOfSpeech"],
      shouldNotMatch: ["arabic"],
    },
  ];
  return await getOptions(position, segIndex, requirements, extraSegments);
}

async function propGetHarfOptions(
  position: string,
  segIndex: string,
  extraSegments?: WordSegment[]
) {
  return await getOptions(position, segIndex, HarfRequirement, extraSegments);
}
const sortedList = sortList(list);
console.log(Object.keys(list), sortedList.length);

for (const i in sortedList) {
  const [s, v, w] = sortedList[i].words[0]?.position.split(":");
  const word = data[+s][+v][+w];
  const extraSegments: WordSegment[] = Array.from(
    sortedList[i].spellings ?? []
  ).map((ara) => {
    return {
      arabic: ara,
      arPartOfSpeech: word[+sortedList[i].words[0]?.segIndex].arPartOfSpeech,
      partOfSpeech: word[+sortedList[i].words[0]?.segIndex].partOfSpeech,
      position: word[+sortedList[i].words[0]?.segIndex].position,
    };
  });

  sortedList[i].options = await sortedList[i].getOptions(
    sortedList[i].words[0]?.position,
    sortedList[i].words[0]?.segIndex,
    extraSegments
  );
  console.log(i + "/" + sortedList.length);
}

// write lists
fs.writeFile(
  "./.seed-data/suffixList.json",

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
function getDescription(word: WordData, segIndex: number) {
  let description =
    (word[segIndex].affix && descriptions[word[segIndex].affix]) ?? "";
  if (!word[segIndex].affix) {
    switch (word[segIndex].person) {
      case 1:
        description += "1st person";
        break;
      case 2:
        description += "2nd person";
        break;
      case 3:
        description += "3rd person";
        break;
    }

    switch (word[segIndex].number) {
      case "S":
        description += " singular";
        break;
      case "D":
        description += " dual";
        break;
      case "P":
        description += " plural";
        break;
    }

    switch (word[segIndex].gender) {
      case "M":
        description += " masculine";
        break;
      case "F":
        description += " feminine";
        break;
    }

    if (
      (word[segIndex].partOfSpeech == "OBJ" ||
        word[segIndex].partOfSpeech == "OBJ2") &&
      word[segIndex].person != 1 &&
      word[segIndex].number != "S"
    ) {
      description += " object/possessive";
    } else {
      switch (word[segIndex].partOfSpeech) {
        case "SUBJ":
          description += " subject";
          break;
        case "OBJ":
          description += " object";
          break;
        case "OBJ2":
          description += " possessive";
          break;
      }
    }
    description += ` pronoun`;

    if (word[segIndex].aspect && word[segIndex].partOfSpeech == "SUBJ") {
      description +=
        " attached to a " +
        (word[segIndex].aspect === "PERF"
          ? "perfect"
          : word[segIndex].aspect === "IMPF"
            ? "imperfect"
            : "imperative") +
        " verb";
    }
  }
  return description;
}
function getSuffixGroupName(word: WordData, segIndex: number) {
  let aspect;
  for (const segment of word) {
    aspect = segment.aspect ?? aspect;
  }
  const value =
    word[segIndex].affix ??
    word[segIndex].person +
      "" +
      (word[segIndex].gender ?? "") +
      word[segIndex].number;
  if (
    word[segIndex].partOfSpeech === "OBJ" ||
    word[segIndex].partOfSpeech === "OBJ2"
  ) {
    if (!(word[segIndex].person == 1 && word[segIndex].number == "S")) {
      return "OBJ_POS-" + value;
    } else {
      return word[segIndex].partOfSpeech + "-" + value;
    }
  }
  if (word[segIndex].partOfSpeech === "SUBJ") {
    return word[segIndex].partOfSpeech + "-" + value + "-" + aspect;
  }
  return value;
}
