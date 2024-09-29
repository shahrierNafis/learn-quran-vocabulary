import { COLOR, WordData } from "../../src/types/types";
import getWordData from "../../src/utils/getWordData";
const b2a = require("buckwalter-transliteration")("qac2utf");
const a2b = require("buckwalter-transliteration")("utf2qac");

export type FillPgn = "1S" | "1P" | "2nd person" | "3FS" | "3rd person";
export default async function getFillPgnOptions(
  prefix: FillPgn,
  wordData: WordData,
  segIndex: number
) {
  const [s, v, w] = wordData[0].position.split(":");
  const segments: WordData = await getWordData(+s, +v, +w);
  const options: WordData[] = [];
  let prefixes: string[] = [];
  switch (prefix) {
    case "1S":
      prefixes = ["n", "t", "y"];
      break;
    case "1P":
      prefixes = [">", "t", "y"];

      break;
    case "2nd person":
      prefixes = [">", "n", "y"];

      break;
    case "3FS":
      prefixes = [">", "n", "y"];

      break;
    case "3rd person":
      prefixes = [">", "n", "t"];

      break;
  }
  prefixes.forEach((p) => {
    const newSegments: WordData = JSON.parse(JSON.stringify(segments));
    newSegments[segIndex].arabic = b2a(
      p + a2b(newSegments[segIndex].arabic.slice(1))
    );
    options.push(newSegments);
  });
  return options;
}
