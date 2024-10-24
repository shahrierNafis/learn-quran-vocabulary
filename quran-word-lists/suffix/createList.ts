import fs from "fs";
import {
  List,
  WordData,
  Requirements,
  WordSegment,
} from "../../src/types/types";
import path from "path";
import { descriptions } from "./descriptions";
import getOptions from "../lib/getOptions";
import { HarfRequirement } from "../lib/requirements";
import sortList from "../lib/sortList";

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
          const [SuffixGroupName, isCompoundGroup] = getSuffixGroupName(
            word,
            +segIndex
          );
          const suffixGroup = list[SuffixGroupName] ?? {
            positions: [] as string[],
            words: [],
            spellings: new Set(),
          };
          const position = `${s}:${v}:${w}`;
          suffixGroup.positions.push(position);
          suffixGroup.words.push({
            position,
            segIndex: segIndex,
          });
          suffixGroup.spellings?.add(word[segIndex].arabic);
          suffixGroup.name = SuffixGroupName;
          suffixGroup.description = isCompoundGroup
            ? descriptions[SuffixGroupName]
            : getDescription(
                word,
                +segIndex,
                Array.from(suffixGroup?.spellings ?? [])
              ) ?? word[segIndex].affix;
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

console.log(
  JSON.stringify(
    sortedList
      .map((sli) => {
        return { name: sli.name, spellings: Array.from(sli.spellings ?? []) };
      })
      .filter((sli) => sli.name.startsWith("SUBJ"))
  )
);

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
function getDescription(word: WordData, segIndex: number, spellings: string[]) {
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
      !(word[segIndex].person == 1 && word[segIndex].number == "S")
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

    if (word[segIndex].partOfSpeech == "SUBJ") {
      description +=
        " attached to a " +
        (word.some((seg) => seg.aspect === "PERF")
          ? "perfect"
          : word.some((seg) => seg.aspect === "IMPF")
            ? "imperfect"
            : "imperative") +
        " verb";
    }
  }
  return description;
}
function getSuffixGroupName(
  word: WordData,
  segIndex: number
): [string, boolean] {
  let aspect, mood;

  for (const segment of word) {
    aspect = segment.aspect ?? aspect;
    mood = segment.mood ?? mood;
  }

  let value =
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
      return ["OBJ_POS-" + value, false];
    } else {
      return [word[segIndex].partOfSpeech + "-" + value, false];
    }
  }
  if (word[segIndex].partOfSpeech === "SUBJ") {
    value = word[segIndex].partOfSpeech + "-" + value + "-" + aspect;
    if (
      mood != "IND" &&
      ((word[segIndex].person == 2 &&
        word[segIndex].number == "P" &&
        word[segIndex].gender == "M" &&
        aspect != "PERF") ||
        (word[segIndex].person == 3 &&
          word[segIndex].gender == "M" &&
          word[segIndex].number == "P"))
    ) {
      return [`SUBJ-!IND((2MP-!PERF)-3MP)`, true];
    }
    if (
      mood == "IND" &&
      word[segIndex].gender == "M" &&
      word[segIndex].number == "P"
    ) {
      return [`MP-IND`, true];
    }
    if (
      (word[segIndex].person == 2 &&
        word[segIndex].number == "P" &&
        word[segIndex].gender == "F" &&
        aspect != "PERF") ||
      (word[segIndex].person == 3 &&
        word[segIndex].gender == "F" &&
        word[segIndex].number == "P")
    ) {
      return [
        `SUBJ((2${word[segIndex].gender}P-!PERF)-3${word[segIndex].gender}P)`,
        true,
      ];
    }
    if (word[segIndex].number == "D") {
      if (aspect == "IMPF" && mood == "IND") {
        return ["SUBJ-D-IMPF-IND", true];
      }
      if (
        (aspect == "IMPF" && mood != "IND") ||
        aspect == "IMPV" ||
        (word[segIndex].person == 3 &&
          word[segIndex].gender == "M" &&
          aspect == "PERF")
      ) {
        return ["SUBJ-D((IMPF-!IND)-(IMPV)-(3M-PERF))", true];
      }
    }
  }

  return [value, true];
}
const a = [
  {
    name: "SUBJ-!IND((2MP-!PERF)-3MP)",
    spellings: [
      "وا۟",
      "وٓا۟",
      "وْا۟",
      "وُا۟",
      "و",
      "وْ",
      "ونَ",
      "ۥٓا۟",
      "وٓ",
      "ۥا۟",
      "ءُو",
    ],
  },
  {
    name: "SUBJ-1P-PERF",
    spellings: ["نَء", "نَّا", "نَا", "نَآ", "نَّء", "نَّآ"],
  },
  {
    name: "SUBJ-2MP-PERF",
    spellings: [
      "تُمْ",
      "تُمُ",
      "تُم",
      "تُمُو",
      "تُّمْ",
      "تُّمُ",
      "تُّمُو",
      "تُّم",
    ],
  },
  { name: "SUBJ-2MS-PERF", spellings: ["تَ", "تَّ"] },
  { name: "SUBJ-1S-PERF", spellings: ["تُ", "تُّ"] },
  {
    name: "SUBJ((2FP-!PERF)-3FP)",
    spellings: ["نَّ", "نَ", "تُنَّ", "تُّنَّ"],
  },
  {
    name: "SUBJ-D((IMPF-!IND)-(IMPV)-(3M-PERF))",
    spellings: ["ا", "آ", "ا۟"],
  },
  { name: "SUBJ-D-IMPF-IND", spellings: ["انِ", "ءنِ"] },
  { name: "SUBJ-2FS-IMPV", spellings: ["ى", "ىٓ", "ي"] },
  { name: "SUBJ-3FD-PERF", spellings: ["تَا", "تَآ"] },
  { name: "SUBJ-2FP-IMPV", spellings: ["نَ"] },
  { name: "SUBJ-2FS-PERF", spellings: ["تِ"] },
  { name: "SUBJ-2FP-IMPF", spellings: ["نَ"] },
  { name: "SUBJ-2D-PERF", spellings: ["تُمَا"] },
];
