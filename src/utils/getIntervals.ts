import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/clients";

export default async function getIntervals(): Promise<{
  [key: number]: number;
}> {
  const supabase = createClient<Database>();
  let { data, error } = await supabase.from("user_intervals").select("*");
  const defaultIntervals: {
    [key: number]: number;
  } = {
    25: 86400000,
    50: 864000000,
    75: 2592000000,
    100: 15552000000,
  };
  if (error || !data || data.length === 0) {
    data =
      (
        await supabase
          .from("user_intervals")
          .upsert(
            Object.keys(defaultIntervals).map((progress) => ({
              progress: +progress,
              interval_ms: defaultIntervals[+progress],
            }))
          )
          .select("*")
      ).data ?? [];
  }
  const intervals: { [key: number]: number } = data.reduce(
    (obj, item) => ({
      ...obj,
      [item.progress]: item.interval_ms,
    }),
    {}
  );

  intervals[100] = intervals[100] ?? 15552000000;

  return intervals;
}
