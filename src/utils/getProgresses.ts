import { Database, Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/clients";
import { Progress } from "./getProgress";
export default async function getProgresses(): Promise<{
  [key: number]: Tables<"user_progress">;
}> {
  const supabase = createClient<Database>();

  const { data, error } = await supabase.from("user_progress").select("*");
  if (error) {
    console.log(error);
  } else {
    const Progresses = {} as {
      [key: number]: Tables<"user_progress">;
    };
    for (const progress of data) {
      Progresses[progress.list] = progress;
    }
    return Progresses;
  }
  return {};
}
