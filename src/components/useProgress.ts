import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/clients";
import { useState, useEffect } from "react";

export default function useProgress(word_group_id: number) {
  const supabase = createClient<Database>();

  const [currentProgress, setCurrentProgress] = useState<number>();
  //setCurrent progress
  useEffect(() => {
    supabase
      .from("user_progress")
      .select("progress")
      .eq("word_group_id", word_group_id)
      .then(({ data, error }) => {
        if (error) {
          alert(error);
        } else {
          return data[0] ? data[0].progress : 0;
        }
        return 0;
      })
      .then(setCurrentProgress);
  }, [supabase, word_group_id]);
  return { currentProgress, setCurrentProgress };
}
