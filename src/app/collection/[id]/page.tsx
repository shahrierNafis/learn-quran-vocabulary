"use client";
import { TableData, columns } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";
import getTableData from "./getTableData";
import getCollection from "@/utils/getCollection";
import LoadingScreen from "@/components/ui/LoadingScreen";
import React from "react";
import { Json } from "@/database.types";
import getProgress, { Progress } from "@/utils/getProgress";
import SetProgress from "./SetProgress";
import { RowSelectionState } from "@tanstack/react-table";
import Learn from "./Learn";
import GotoDashboard from "@/components/GotoDashboard";
export default function Page({ params: { id } }: { params: { id: string } }) {
  const [name, setName] = useState<string>();
  const [collection, setCollection] = useState<Json>([]);
  const [[progress, progressID], setProgress] = useState<
    [Progress, number | undefined | null]
  >([[], undefined]);

  const [data, setData] = useState<TableData[]>();
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  useEffect(() => {
    getCollection(+id).then(({ name, collection }) => {
      setCollection(collection);
      setName(name);
    });
    getProgress(id).then(({ progress, progressId }) => {});
    getProgress(id).then(({ progress, progressId }) => {
      setProgress([progress as Progress, progressId]);
    });
    return () => {};
  }, [id]);

  useEffect(() => {
    getTableData(collection, progress).then((data) => {
      setData(data);
    });
    return () => {};
  }, [collection, progress]);

  return (
    <>
      <GotoDashboard />
      {data && name ? (
        <>
          <div className="max-w-screen-md mx-auto">
            <div className="text-3xl flex items-center justify-center">
              {name}
            </div>
            <div className="rounded-md border">
              <Learn className="float-right" {...{ id }} />
              <DataTable
                {...{ columns, data, rowSelection, setRowSelection }}
              />
            </div>
            <SetProgress
              {...{ id, setProgress, rowSelection, progress, progressID }}
            />
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
