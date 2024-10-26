import { createClient } from "@/utils/supabase/clients";
import { Database, Tables } from "@/database.types";
import { useEffect, useState } from "react";
import Collection from "./Collection";
import _ from "lodash";
export default function Collections({
  wordGroups,
  progressArr,
}: {
  wordGroups: { id: number; words: string[]; collection_id: number }[];
  progressArr:
    | {
        progress: number;
        word_group_id: number;
        updated_at: string;
        word_groups: {
          collection_id: number;
          id: number;
        } | null;
      }[]
    | null;
}) {
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
  }, [supabase]);

  return (
    <>
      <div className="p-2 border m-2">
        <div className="text-3xl text-center">Collections</div>
        {data.map((collection) => (
          <Collection
            key={collection.id}
            {...{
              collection,
              wordGroups: wordGroups?.filter(
                (d) => d.collection_id == collection.id
              ),
              progressArr:
                progressArr?.filter(
                  (d) => d.word_groups?.collection_id == collection.id
                ) ?? [],
            }}
          />
        ))}
      </div>
    </>
  );
}
