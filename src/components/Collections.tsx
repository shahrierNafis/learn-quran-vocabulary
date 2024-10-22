import { createClient } from "@/utils/supabase/clients";
import { Database, Tables } from "@/database.types";
import { useEffect, useState } from "react";
import Collection from "./Collection";
import _ from "lodash";
export default function Collections() {
  const supabase = createClient<Database>();
  const [data, setData] = useState<Tables<"collections">[]>([]);

  useEffect(() => {
    supabase
      .from("collections")
      .select("*")
      .order("id", { ascending: true })
      .eq("is_default", true)
      .then(({ data, error }) => {
        if (error) {
          console.log(error);
        } else {
          setData((oldData) =>
            _.uniqBy(
              [
                ...oldData,
                ...(data.map((d) => d as any)?.filter(Boolean) ?? []),
              ],
              "id"
            )
          );
        }
      });
    // supabase
    //   .from("user_to_collection")
    //   .select("collection:collections(id,name)")
    //   .then(({ data, error }) => {
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       setData((oldData) =>
    //         _.uniqBy(
    //           [
    //             ...oldData,
    //             ...(data.map((d) => d.collection as any)?.filter(Boolean) ?? []),
    //           ],
    //           "id"
    //         )
    //       );
    //     }
    //   });
  }, [supabase]);

  return (
    <>
      <div className="p-2 border m-2">
        <div className="text-3xl text-center">Collections</div>
        {data.map((collection) => (
          <Collection key={collection.id} collection={collection} />
        ))}
      </div>
    </>
  );
}
