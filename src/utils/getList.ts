import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/clients";

export default async function getList(id: number) {
  const supabase = createClient<Database>();

  const { list, name } = await supabase
    .from("lists")
    .select("name,list,id")
    .eq("id", id)
    .then(({ data, error }) => {
      if (error) {
        console.log(error);
      } else {
        return data[0];
      }
      return { name: "", list: "", id: "" };
    });

  return { name, list, id };
}
