import { createClient } from "@/utils/supabase/clients";
import { Database, Tables } from "@/database.types";
import { useEffect, useState } from "react";
import List from "./List";
import _ from "lodash";
export default function Lists() {
  const supabase = createClient<Database>();
  const [data, setData] = useState<Tables<"lists">[]>([]);

  useEffect(() => {
    supabase
      .from("default_lists")
      .select("lists(id,name)")
      .then(({ data, error }) => {
        if (error) {
          console.log(error);
        } else {
          setData((oldData) =>
            _.uniqBy(
              [
                ...oldData,
                ...(data.map((d) => d.lists as any)?.filter(Boolean) ?? []),
              ],
              "id"
            )
          );
        }
      });
    // supabase
    //   .from("user_to_list")
    //   .select("list:lists(id,name)")
    //   .then(({ data, error }) => {
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       setData((oldData) =>
    //         _.uniqBy(
    //           [
    //             ...oldData,
    //             ...(data.map((d) => d.list as any)?.filter(Boolean) ?? []),
    //           ],
    //           "id"
    //         )
    //       );
    //     }
    //   });
  }, []);

  return (
    <>
      <div className="p-2 border m-2">
        <div className="text-3xl">Lists</div>
        {data.map((list) => (
          <List key={list.id} list={list} />
        ))}
      </div>
    </>
  );
}
