"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronRight, ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import getWord from "@/utils/getWord";
import { WORD } from "@/types/types";
import { Database, Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/clients";
import Link from "@/components/ui/Link";

import Word from "@/components/Word";
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
    header: () => <div className="text-center">Index</div>,
    cell: ({ row, getValue }) => {
      return (
        <>
          <div
            className={`flex items-center justify-center gap-2`}
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
              <div>
                <Link href={"\\wordGroup\\" + row.original.id}>
                  {getValue() as string}
                </Link>
              </div>
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
    header: () => <div className="text-center">word</div>,
    cell: function Cell({ row, getValue }) {
      const [word, setWord] = useState<WORD>();
      const index = getValue() as `${string}:${string}:${string}`;
      useEffect(() => {
        getWord(index).then(setWord);
      }, [index]);
      return (
        <>
          <div className="flex justify-center items-center">
            <Link href={"\\wordGroup\\" + row.original.id}>
              <div className="flex justify-center h-fit w-40 border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                {word ? (
                  <>
                    <div className="flex flex-col">
                      <div className="text-center p-2 m-2 dark:text-red-100 text-red-950 text-sm">
                        {row.original.name}
                      </div>
                      <div dir="rtl" className="text-3xl text-center">
                        <Word wordSegments={word.wordSegments} noWordInfo />
                      </div>
                      <div className="dark:text-green-100 text-green-950 text-center text-sm">
                        {word.transliteration.text}
                      </div>
                      {/* <div className="dark:text-red-100 text-red-950 text-center text-sm">
                    {word.translation.text}
                  </div> */}
                    </div>
                  </>
                ) : (
                  <div className="h-[2.25rem] opacity-50 text-sm">
                    loading...
                  </div>
                )}
              </div>
            </Link>
          </div>
        </>
      );
    },
  },
  {
    accessorFn: (originalRow: TableData, index: number) => {
      return originalRow.words.length;
    },
    id: "Frequency",
    header: () => <div className="text-center">Frequency</div>,
    cell: ({ row, getValue }) => {
      if (row.depth != 0) return "";
      return (
        <>
          <div className="flex"></div>
          <Link href={"\\wordGroup\\" + row.original.id}>
            <div className="text-center">{getValue() as string}</div>
          </Link>
        </>
      );
    },
  },
  {
    accessorFn: (originalRow: TableData, index: number) => {
      return originalRow.words[0];
    },
    id: "progress",
    header: () => <div className="text-center">progress</div>,
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
      if (row.depth != 0) return "";
      if (progress) {
        return (
          <>
            <div className="flex"></div>
            <Link href={"\\wordGroup\\" + row.original.id}>
              <div className="text-center">{progress}%</div>
            </Link>
          </>
        );
      }
      return (
        <>
          <div className="flex"></div>
          <Link href={"\\wordGroup\\" + row.original.id}>
            <div className="text-center">0%</div>
          </Link>
        </>
      );
    },
  },
  {
    accessorKey: "updatedOn",
    id: "updatedOn",
    header: () => <div className="text-center">updatedOn</div>,
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
      if (row.depth != 0) return "";
      return (
        <>
          <div className="flex">
            <Link href={"\\wordGroup\\" + row.original.id}>
              {updatedAt ? (
                <div className="text-center">
                  {new Date(updatedAt).toLocaleString("en-GB").split(",")[0]}
                </div>
              ) : (
                <>----</>
              )}
            </Link>
          </div>
        </>
      );
    },
  },
];
