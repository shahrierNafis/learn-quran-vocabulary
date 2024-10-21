import { Requirements, WordData, WordSegment } from "../../src/types/types";
type Data = {
  [key: string]: {
    [key: string]: {
      [key: string]: WordData;
    };
  };
};
const data: Data = require("./../data.json");

export default async function getOptions(
  position: string,
  segIndex: string,
  requirements: Requirements,
  extraSegments?: WordSegment[]
): Promise<WordData[]> {
  const Segments: WordSegment[] = [];
  const [s, v, w] = position.split(":");
  const wordData = data[+s][+v][+w];
  const shuffledWordData = Object.values(
    shuffleObjectProperties(flattenDataObject(data))
  ) as WordData[];
  for (const { shouldNotMatch, shouldMatch } of requirements) {
    if (Segments.length != 3) {
      forLoop(shouldNotMatch, shouldMatch);
    }
  }
  if (Segments.length != 3) {
    throw new Error(JSON.stringify(wordData));
  }
  function forLoop(shouldNotMatch: string[], shouldMatch: string[]) {
    for (const randomWordData of shuffledWordData) {
      for (const randomSegment of randomWordData) {
        if (Segments.length === 3) {
          break;
        }
        if (
          [wordData[+segIndex], ...Segments, ...(extraSegments ?? [])].every(
            (wd) =>
              Object.keys(wd).every((k) => {
                if (shouldNotMatch.includes(k)) {
                  return (randomSegment as any)[k] !== (wd as any)[k];
                } else if (shouldMatch.includes(k)) {
                  return (randomSegment as any)[k] === (wd as any)[k];
                }
                return true;
              })
          )
        ) {
          Segments.push(randomSegment);
        }
      }
    }
  }

  return Segments.map((seg) => {
    const newWordData = JSON.parse(JSON.stringify(wordData));
    newWordData[+segIndex] = seg;
    if (wordData.length != newWordData.length) {
      throw new Error();
    }
    return newWordData;
  });
}

function shuffleObjectProperties<T extends Record<string, any>>(obj: T): T {
  // Get the keys of the object
  const keys = Object.keys(obj);

  // Shuffle the keys using Fisher-Yates algorithm
  for (let i = keys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [keys[i], keys[j]] = [keys[j], keys[i]];
  }

  // Create a new object with shuffled keys
  const shuffledObj = {} as T;
  keys.forEach((key) => {
    (shuffledObj as any)[key] = obj[key];
  });

  return shuffledObj;
}
function flattenDataObject(
  data: Data,
  result: { [key: string]: WordData } = {}
): { [key: string]: WordData } {
  for (const surah in data) {
    for (const verse in data[surah]) {
      for (const word in data[surah][verse]) {
        result[surah + ":" + verse + ":" + word] = data[surah][verse][word];
      }
    }
  }
  return result;
}
