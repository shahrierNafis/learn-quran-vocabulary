import { Database, Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/clients";
import React, { useEffect, useState } from "react";

export default function CollectionProgress({
  collection_id,
}: {
  collection_id: number;
}) {
  const supabase = createClient<Database>();

  const [wordGroups, setWordGroups] = useState<
    { id: number; words: string[] }[]
  >([]);
  const [progressArr, setProgressArr] = useState<
    | {
        progress: number;
        word_groups: {
          collection_id: number;
          id: number;
        } | null;
      }[]
    | null
  >([]);

  useEffect(() => {
    supabase
      .from("word_groups")
      .select("id,words")
      .eq("collection_id", collection_id)
      .limit(10000)
      .then(({ error, data }) => {
        if (error || !data) {
          console.log(error);
        } else {
          setWordGroups(data);
        }
      });
  }, [collection_id, supabase]);
  useEffect(() => {
    supabase
      .from("user_progress")
      .select("progress,word_groups(collection_id, id)")
      .then(({ error, data }) => {
        if (error || !data) {
          console.log(error);
        } else {
          setProgressArr(
            data.filter((d) => d.word_groups?.collection_id == collection_id)
          );
        }
      });
  }, [collection_id, supabase, wordGroups]);

  return (
    <>
      <div
        style={{
          gridTemplateColumns: "auto auto",
        }}
        className="grow w-full text-nowrap text-xs text-gray-500 grid grid-rows-3"
      >
        <div>Introduced:</div>
        {progressArr ? (
          <div className="text-center">
            {progressArr.length}/{wordGroups.length}
          </div>
        ) : (
          "loading"
        )}
        <div>Mastered: </div>
        {progressArr ? (
          <div className="text-center">
            {roundNumber(
              (progressArr
                .map((pA) => pA.progress)
                .reduce((prev, curr) => prev + curr, 0) /
                (wordGroups.length * 100)) *
                100
            )}
            %
          </div>
        ) : (
          "loading"
        )}
        <div className="text-nowrap">Word coverage: </div>
        {progressArr ? (
          <div className="text-center">
            {roundNumber(
              (progressArr
                .map((pA) =>
                  pA.word_groups
                    ? pA.progress *
                      wordGroups.filter(
                        (wg) => pA.word_groups && wg.id == pA.word_groups.id
                      )[0]?.words.length
                    : 0
                )
                .reduce((prev, curr) => prev + curr, 0) /
                wordGroups
                  .map((pA) => pA.words.length * 100)
                  .reduce((prev, curr) => prev + curr, 0)) *
                100
            )}
            %
          </div>
        ) : (
          "loading"
        )}
      </div>
    </>
  );
}
function roundNumber(num: number) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}
