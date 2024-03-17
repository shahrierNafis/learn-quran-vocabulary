"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronRight, ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import getWord from "@/utils/getWord";
import { Word } from "@/types/types";
import { Database, Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/clients";
export type TableData = Tables<"word_groups">;

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
    accessorFn: (originalRow: TableData, index: number) => {
      return originalRow.words[0];
    },
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
    accessorFn: (originalRow: TableData, index: number) => {
      return originalRow.words[0];
    },
    id: "word",
    header: "word",
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
              <div className={`md:text-3xl`}>{word.text_imlaei}</div>
            </>
          ) : (
            <div className="h-[2.25rem] opacity-50 text-sm">loading...</div>
          )}
        </>
      );
    },
  },
  {
    accessorFn: (originalRow: TableData, index: number) => {
      return originalRow.words[0];
    },
    id: "progress",
    header: "progress",
    cell: function Cell({ row, getValue }) {
      const [progress, setProgress] = useState<number | null>();
      const supabase = createClient<Database>();
      useEffect(() => {
        if (row.depth == 0) {
          supabase
            .from("user_progress")
            .select("progress")
            .eq("word_group_id", row.original.id)
            .single()
            .then(({ data, error }) => {
              if (error) {
                // console.error(error);
              } else {
                setProgress(data.progress);
              }
            });

          const realtime = supabase
            .channel("progress" + row.original.id)
            .on(
              "postgres_changes",
              {
                event: "*",
                schema: "public",
                table: "user_progress",
                filter: `word_group_id=eq.${row.original.id}`,
              },
              (payload) => {
                setProgress((payload.new as Tables<"user_progress">).progress);
              }
            )
            .subscribe();

          return () => {
            realtime.unsubscribe();
          };
        }
      }, [getValue, progress, row, supabase]);

      if (progress) {
        return (
          <>
            <div>{progress}%</div>
          </>
        );
      }
      return <>0%</>;
    },
  },
  {
    accessorKey: "updatedOn",
    id: "updatedOn",
    header: "updatedOn",
    cell: function Cell({ row, getValue }) {
      const [updatedAt, setUpdatedAt] = useState<string | null>();
      const supabase = createClient<Database>();
      useEffect(() => {
        if (row.depth == 0) {
          supabase
            .from("user_progress")
            .select("updated_at")
            .eq("word_group_id", row.original.id)
            .single()
            .then(({ data, error }) => {
              if (error) {
                // console.error(error);
              } else {
                setUpdatedAt(data.updated_at);
              }
            });

          const realtime = supabase
            .channel("updatedOn" + row.original.id)
            .on(
              "postgres_changes",
              {
                event: "*",
                schema: "public",
                table: "user_progress",
                filter: `word_group_id=eq.${row.original.id}`,
              },
              (payload) => {
                setUpdatedAt(
                  (payload.new as Tables<"user_progress">).updated_at
                );
              }
            )
            .subscribe();

          return () => {
            realtime.unsubscribe();
          };
        }
      }, [getValue, row, supabase]);

      return (
        <>
          {updatedAt ? (
            <div>
              {new Date(updatedAt).toLocaleString("en-GB").split(",")[0]}
            </div>
          ) : (
            <>----</>
          )}
        </>
      );
    },
  },
];
