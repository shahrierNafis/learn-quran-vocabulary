import getChapterLength from "./getChapterLength";

export default function getPretendIterationNum(
  chapter: number,
  WOEProgress: { [key: number]: number }
) {
  if (WOEProgress[chapter] == 0) return 1;
  return Math.ceil(
    (WOEProgress[chapter] - 0.0000001) / getChapterLength(chapter)
  );
}
