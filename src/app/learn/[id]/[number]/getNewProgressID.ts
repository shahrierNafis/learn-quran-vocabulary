import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/clients";

export default async function getNewProgressID(id: number) {
  const supabase = createClient<Database>();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return (
    await (user &&
      supabase
        .from("user_progress")
        .insert({
          user: user.id,
          list: id,
          progress: {},
        })
        .select("id")
        .then(({ data, error }) => {
          if (error) {
            throw new Error(error.message);
          } else {
            return data[0];
          }
        }))!
  ).id;
}
