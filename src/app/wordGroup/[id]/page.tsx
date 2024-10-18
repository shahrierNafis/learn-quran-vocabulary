"use client";
import GotoDashboard from "@/components/GotoDashboard";
import SimilarWordsTable from "@/components/SimilarWordsTable";
import { Database, Tables } from "@/database.types";
import { usePreferenceStore } from "@/stores/preference-store";
import { useShallow } from "zustand/react/shallow";

import { createClient } from "@/utils/supabase/clients";
import React, { useEffect, useState } from "react";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const [translation_ids] = usePreferenceStore(
    useShallow((a) => [a.translation_ids])
  );

  useEffect(() => {
    usePreferenceStore.persist.rehydrate();
  }, []);

  const supabase = createClient<Database>();
  const [wordGroup, setWordGroup] = useState<Tables<"word_groups">>();
  useEffect(() => {
    supabase
      .from("word_groups")
      .select("*")
      .eq("id", id)
      .then(({ data, error }) => {
        if (error) {
          console.log(error);
        } else {
          setWordGroup(data[0]);
        }
      });
  }, [id, supabase]);

  return (
    <>
      {wordGroup && (
        <>
          <div className="p-4">
            <div className="text-center text-3xl">{wordGroup.name}</div>
            <div className={`${!wordGroup.name && "text-center text-3xl"}`}>
              {wordGroup.description}
            </div>
            <SimilarWordsTable
              {...{
                wordGroup,
                translation_ids,
              }}
            />
          </div>
        </>
      )}
    </>
  );
}
