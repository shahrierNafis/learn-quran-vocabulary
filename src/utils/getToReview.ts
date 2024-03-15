import { Database, Tables } from "@/database.types";
import getIntervals from "@/utils/getIntervals";
import { createClient } from "./supabase/clients";
export default async function getToReview(): Promise<Tables<"word_groups">[]> {
  const intervals = await getIntervals();
  const toReview: number[] = [];
  const supabase = createClient<Database>();
  const progresses = await supabase
    .from("user_progress")
    .select("*")
    .then(({ data, error }) => {
      if (error) {
        console.log(error);
      } else {
        return data;
      }
      return [];
    });

  for (const { progress, word_group_id, updated_at } of progresses) {
    const interval = getInterval(intervals, progress);
    const updatedOn = new Date(updated_at).getTime();
    const current = new Date().getTime();
    if (updatedOn + interval < current) {
      toReview.push(+word_group_id);
    }
  }
  return await supabase
    .from("word_groups")
    .select("*")
    .in("id", toReview)
    .then(({ data, error }) => {
      if (error) {
        console.log(error);
      } else {
        return data;
      }
      return [];
    });
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
