import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/clients";

export default async function getPreference() {
  const supabase = createClient<Database>();
  const { data, error } = await supabase
    .from("user_preference")
    .select("*")
    .single();
  if (error) {
    console.log(error.message);
  } else {
    return data;
  }
  return {
    intervals: {
      25: 86400000,
      50: 864000000,
      75: 2592000000,
      100: 15552000000,
    },
    translation_id: 131,
  };
}
