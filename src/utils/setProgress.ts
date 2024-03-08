import { Database } from "@/database.types";
import { createClient } from "./supabase/clients";
import { Progress } from "./getProgress";

export default async function setProgress({
  progressID,
  listID,
  progress,
}: {
  progressID: number | null | undefined;
  listID: number;
  progress: Progress;
}): Promise<[Progress, number | null | undefined]> {
  const supabase = createClient<Database>();

  // update record
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  const { data, error } = await (user &&
    supabase
      .from("user_progress")
      .upsert({
        id: progressID ?? undefined,
        list: listID,
        progress,
        user: user.id,
      })
      .select("id") // If new record is created set progressID
      .single())!;

  if (error) {
    console.log(error);
    return [progress, progressID];
  } else {
    return [progress, data.id];
  }
}
