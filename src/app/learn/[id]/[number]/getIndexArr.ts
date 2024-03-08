import { Progress } from "@/utils/getProgress";
import getNewProgressID from "./getNewProgressID";

// eslint-disable-next-line import/no-anonymous-default-export
export default async function ({
  list,
  progress,
  progressID,
  number,
  id,
}: {
  list: string[][];
  progress: Progress;
  number: number;
  progressID: number | null;
  id: number | string;
}) {
  const indexArr: number[] = [];
  let index = 0;
  while (number && index < (list as string[][]).length) {
    if (progress[index] == undefined || progress[index].percentage == 0) {
      indexArr.push(index);
      number--;
    }
    index++;
  }
  return indexArr;
}
