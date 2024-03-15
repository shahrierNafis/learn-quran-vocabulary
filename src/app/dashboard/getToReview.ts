import { Tables } from "@/database.types";
import getPreference from "@/utils/getPreference";
import { Progress } from "@/utils/getProgress";
export type ToReview = { listId: number; toReview: number[] }[];
export default async function getToReview(progresses: {
  [key: number]: Tables<"user_progress">;
}): Promise<ToReview> {
  const { intervals } = (await getPreference()) as {
    intervals: { [key: number]: number };
  };
  const toReview: ToReview = [];
  for (const list of Object.keys(progresses)) {
    const progress = progresses[+list].progress as Progress;
    const arr = [];
    for (const wordID in progress) {
      const interval = getInterval(intervals, progress[+wordID].percentage);
      const updatedOn = new Date(progress[+wordID].updatedOn!).getTime();
      const current = new Date().getTime();
      if (updatedOn + interval < current) {
        arr.push(+wordID);
      }
    }
    toReview.push({ listId: +list, toReview: arr });
  }
  return toReview;
}
function getInterval(intervals: { [key: number]: number }, percentage: number) {
  Object.keys(intervals).sort((a, b) => +b - +a);
  for (const step of Object.keys(intervals)) {
    if (+step >= percentage) {
      return intervals[+step];
    }
  }
  return 0;
}
