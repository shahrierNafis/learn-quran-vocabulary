"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronRight, ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import getWord, { Word } from "@/utils/getWord";
export type TableData = {
  index: `${string}:${string}:${string}`;
  subRows?: TableData[];
  progress?: number;
  updatedOn?: string;
};

export const columns: ColumnDef<TableData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <>
        {row.depth == 0 && (
          <>
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </>
        )}
      </>
    ),
  },
  {
    accessorKey: "index",
    id: "index",
    header: "Index",
    cell: ({ row, getValue }) => {
      return (
        <>
          <div
            className={`flex items-center gap-2`}
            style={{ paddingLeft: `${row.depth * 2}rem` }}
            key={row.id}
          >
            <>
              {row.getCanExpand() ? (
                <button
                  className="cursor-pointer"
                  onClick={row.getToggleExpandedHandler()}
                >
                  {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
                </button>
              ) : (
                row.depth == 0 && <ChevronRight className="opacity-50" />
              )}
              {getValue()}
            </>
          </div>
        </>
      );
    },
  },
  {
    accessorKey: "index",
    id: "verse",
    header: "verse",
    cell: function Cell({ row, getValue }) {
      const [word, setWord] = useState<Word>();
      const index = getValue() as `${string}:${string}:${string}`;
      useEffect(() => {
        getWord(index).then(setWord);
      }, [index]);
      return (
        <>
          {word ? (
            <>
              <div className={`md:text-3xl`}>{word.text}</div>
            </>
          ) : (
            <div className="h-[2.25rem] opacity-50 text-sm">loading...</div>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "progress",
    id: "progress",
    header: "progress",
    cell: ({ row, getValue }) => {
      if (row.depth == 0) {
        return (
          <>
            <div>{getValue() as string}%</div>
          </>
        );
      }
      return <></>;
    },
  },
  {
    accessorKey: "updatedOn",
    id: "updatedOn",
    header: "updatedOn",
    cell: ({ row, getValue }) => {
      if (row.depth == 0) {
        return (
          <>
            {getValue() ? (
              <div>
                {
                  new Date(getValue() as string)
                    .toLocaleString("en-GB")
                    .split(",")[0]
                }
              </div>
            ) : (
              <>----</>
            )}
          </>
        );
      }
      return <></>;
    },
  },
];
