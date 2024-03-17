import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/clients";

export default async function getIntervals(): Promise<{
  [key: number]: number;
}> {
  const supabase = createClient<Database>();
  const { data, error } = await supabase.from("user_intervals").select("*");
  if (error || data.length === 0) {
  } else {
    return data.reduce((obj, item) => ({
      ...obj,
      [item.progress]: item.interval_ms,
    }));
  }
  return {
    25: 86400000,
    50: 864000000,
    75: 2592000000,
    100: 15552000000,
  };
}
