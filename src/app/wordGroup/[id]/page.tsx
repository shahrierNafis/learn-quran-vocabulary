"use client";
import GotoDashboard from "@/components/GotoDashboard";
import SimilarWordsTable from "@/components/SimilarWordsTable";
import { Database, Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/clients";
import { useLocalStorage } from "@uidotdev/usehooks";
import React, { useEffect, useState } from "react";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const [translation_id] = useLocalStorage<number>("translation_id", 20);
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
      <GotoDashboard />

      {wordGroup && (
        <>
          <div className="p-4">
            <div className="text-center text-3xl">{wordGroup.name}</div>
            <div>{wordGroup.description}</div>
            <SimilarWordsTable
              {...{
                wordGroup,
                translation_id,
              }}
            />
          </div>
        </>
      )}
    </>
  );
}
