import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/clients";

export default async function getCollection(id: number) {
  const supabase = createClient<Database>();

  const { collection, name } = await supabase
    .from("collections")
    .select("name,collection,id")
    .eq("id", id)
    .then(({ data, error }) => {
      if (error) {
        console.log(error);
      } else {
        return data[0];
      }
      return { name: "", collection: "", id: "" };
    });

  return { name, collection, id };
}
