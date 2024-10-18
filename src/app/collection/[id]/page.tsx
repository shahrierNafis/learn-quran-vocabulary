"use client";
import { TableData, columns } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/ui/LoadingScreen";
import React from "react";
import { Database, Tables } from "@/database.types";
import SetProgress from "./SetProgress";
import { RowSelectionState } from "@tanstack/react-table";
import PlayBtn from "../../../components/PlayBtn";
import GotoDashboard from "@/components/GotoDashboard";
import getCollectionName from "@/utils/getCollectionName";
import { createClient } from "@/utils/supabase/clients";
export default function Page({ params: { id } }: { params: { id: string } }) {
  const [name, setName] = useState<string | null>();
  const [wordGroups, setWordGroups] = useState<Tables<"word_groups">[]>();

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const supabase = createClient<Database>();

  useEffect(() => {
    getCollectionName(+id).then(setName);
    return () => {};
  }, [id]);

  useEffect(() => {
    !wordGroups &&
      supabase
        .rpc("get_word_groups", { collection_id: +id })
        .then(({ data, error }) => {
          if (error) {
            console.log(error);
          } else {
            setWordGroups(data);
          }
        });
  }, [id, supabase, wordGroups]);

  return (
    <>
      {wordGroups && name ? (
        <>
          <div className="max-w-screen-md mx-auto">
            <div className="text-3xl flex items-center justify-center">
              {name}
            </div>
            <div className="rounded-md border">
              <PlayBtn className="float-right" {...{ id }} />
              <DataTable
                {...{
                  columns,
                  data: wordGroups,
                  rowSelection,
                  setRowSelection,
                }}
              />
            </div>
            <SetProgress {...{ id, rowSelection, wordGroups }} />
          </div>
        </>
      ) : (
        <>
          <LoadingScreen />
        </>
      )}
    </>
  );
}
