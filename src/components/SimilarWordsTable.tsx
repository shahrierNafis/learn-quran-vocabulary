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

export default memo(function SimilarWordsTable({
  wordGroup,
  translation_id,
}: {
  wordGroup: Tables<"word_groups">;
  translation_id: number;
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
              translation_id,
              verse_key: getValue() as `${string}:${string}${string}`,
            }}
          />
        );
      },
    },
  ];
  const data = useMemo(() => wordGroup.words.slice(1), [wordGroup.words]);
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
  translation_id,
}: {
  verse_key: `${string}:${string}${string}`;
  translation_id: number;
}) {
  const [sentence, setSentence] = useState<Word[]>();
  const [translation, setTranslation] = useState<string>();
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
    getVerseTranslation(translation_id, `${surah}:${verse}`).then(
      setTranslation
    );

    return () => {};
  }, [translation_id, verse_key]);
  return (
    <>
      {sentence && translation && (
        <>
          <div className="flex flex-col justify-center items-center">
            <div
              dir="rtl"
              className="flex gap-2 flex-wrap  text-center text-2xl"
            >
              {/* ARABIC */}
              {sentence.map((word, index) => {
                if (word.char_type_name !== "word") return "";
                return (
                  <>
                    <div className="flex flex-col">
                      <div
                        className={cn(
                          index == +verse_key.split(":")[2] - 1 &&
                            "text-green-500"
                        )}
                      >
                        {word.text_imlaei}
                      </div>
                      <div className="">
                        {showTransliteration && (
                          <div className="text-green-100 text-sm">
                            {word.transliteration.text}
                          </div>
                        )}
                        {showTranslation && (
                          <div className="text-red-100 text-xs">
                            {word.translation.text}{" "}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
            {/* TRANSLATION */}
            <div className="text-xl">
              {translation?.replaceAll(/<sup.*>.*<\/sup>/g, "")}
            </div>
          </div>
        </>
      )}
    </>
  );
}
