import { Database, Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/clients";
import React, { useEffect, useState } from "react";

export default function CollectionProgress({
  progressArr,
  wordGroups,
}: {
  progressArr:
    | {
        progress: number;
        word_groups: {
          collection_id: number;
          id: number;
        } | null;
      }[]
    | null;
  wordGroups: {
    id: number;
    words: string[];
  }[];
}) {
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
