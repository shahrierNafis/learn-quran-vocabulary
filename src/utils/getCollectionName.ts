import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/clients";

export default async function getCollection(id: number) {
  const supabase = createClient<Database>();

  return await supabase
    .from("collections")
    .select("name,id")
    .eq("id", id)
    .then(({ data, error }) => {
      if (error) {
        console.log(error);
      } else {
        return data[0].name;
      }
      return null;
    });
}
