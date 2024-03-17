import { Progress } from "@/utils/getProgress";
import getNewProgressID from "./getNewProgressID";

// eslint-disable-next-line import/no-anonymous-default-export
export default async function ({
  collection,
  progress,
  progressID,
  number,
  id,
}: {
  collection: string[][];
  progress: Progress;
  number: number;
  progressID: number | null;
  id: number | string;
}) {
  const indexArr: number[] = [];
  let index = 0;
  while (number && index < (collection as string[][]).length) {
    if (progress[index] == undefined || progress[index].percentage == 0) {
      indexArr.push(index);
      number--;
    }
    index++;
  }
  return indexArr;
}
