import { Tables } from "@/database.types";
import { usePreferenceStore } from "@/stores/preference-store";
export default async function getToReviewIds(
  progresses: { progress: number; word_group_id: number; updated_at: string }[]
) {
  const intervals = usePreferenceStore.getState().intervals;
  type a = Tables<"user_progress">;
  const toReview: number[] = [];

  for (const { progress, word_group_id, updated_at } of progresses) {
    const interval = getInterval(intervals, progress);
    const updatedOn = new Date(updated_at).getTime();
    const current = new Date().getTime();
    if (updatedOn + interval < current) {
      toReview.push(+word_group_id);
    }
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
