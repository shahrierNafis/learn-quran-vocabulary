"use client";
import React, { memo, useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import getVerseWords from "@/utils/getVerseWords";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getVerseTranslation from "@/utils/getVerseTranslation";
import { DataTablePagination } from "./ui/DataTablePagination";
import { Word } from "@/types/types";
import { Tables } from "@/database.types";
import { useLocalStorage } from "@uidotdev/usehooks";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import getVerseTranslations from "@/utils/getVerseTranslations";
import Translations from "./Translations";
import WordImage from "./WordImage";

export default memo(function SimilarWordsTable({
  wordGroup,
  translation_ids,
}: {
  wordGroup: Tables<"word_groups">;
  translation_ids: string[];
}) {
  const columns: ColumnDef<string>[] = [
    {
      accessorFn: (index) => index,
      header: "Index",
    },
    {
      accessorFn: (index) => index,
      header: "verse",
      cell: function Cell({ getValue }) {
        return (
          <CellComponent
            {...{
              translation_ids,
              verse_key: getValue() as `${string}:${string}${string}`,
            }}
          />
        );
      },
    },
  ];
  const data = useMemo(() => wordGroup.words, [wordGroup.words]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </div>
  );
});

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
function CellComponent({
  verse_key,
  translation_ids,
}: {
  verse_key: `${string}:${string}${string}`;
  translation_ids: string[];
}) {
  const [sentence, setSentence] = useState<Word[]>();
  const [translations, setTranslations] =
    useState<Awaited<ReturnType<typeof getVerseTranslations>>>();
  const [showTranslation] = useLocalStorage<boolean>("showTranslation", true);
  const [showTransliteration] = useLocalStorage<boolean>(
    "showTransliteration",
    true
  );
  // set sentence
  useEffect(() => {
    getVerseWords(verse_key).then(setSentence);

    return () => {};
  }, [verse_key]);
  // set translation
  useEffect(() => {
    const [surah, verse] = verse_key.split(":");
    getVerseTranslations(translation_ids, `${surah}:${verse}`).then((r) =>
      setTranslations(r)
    );

    return () => {};
  }, [translation_ids, verse_key]);
  return (
    <>
      <>
        <div className="flex flex-col gap-2 justify-center items-center">
          <div dir="rtl" className="flex gap-2 flex-wrap  text-center text-2xl">
            {/* ARABIC */}
            {sentence ? (
              sentence.map((word, index) => {
                if (word.char_type_name !== "word") return "";
                return (
                  <>
                    <div key={word.index} className="flex flex-col">
                      <div
                        className={cn(
                          "p-2",
                          index == +verse_key.split(":")[2] - 1 &&
                            "border-2 p-2 rounded border-green-500"
                        )}
                      >
                        <WordImage {...{ word }} />
                      </div>
                      <div className="">
                        {showTransliteration && (
                          <div className="dark:text-green-100 text-green-950 text-sm">
                            {word.transliteration.text}
                          </div>
                        )}
                        {showTranslation && (
                          <div className="dark:text-red-100 text-red-950 text-xs">
                            {word.translation.text}{" "}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                );
              })
            ) : (
              <>
                <Skeleton className="w-[75vw] h-[45px] rounded-full" />
              </>
            )}
          </div>
          {/* TRANSLATION */}
          <Translations {...{ translations }}></Translations>
        </div>
      </>
    </>
  );
}
