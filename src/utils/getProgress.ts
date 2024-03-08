import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/clients";
export type Progress = {
  [key: number]: { percentage: number; updatedOn?: string };
};
export default async function getProgress(id: string) {
  const supabase = createClient<Database>();

  const { progress, id: progressId } = await supabase
    .from("user_progress")
    .select("progress,id")
    .eq("list", id)
    .then(({ data, error }) => {
      if (error) {
        alert(error);
      } else {
        return data[0] ?? { progress: null, id: null };
      }
      return { progress: null, id: null };
    });

  return { progress, progressId };
}
