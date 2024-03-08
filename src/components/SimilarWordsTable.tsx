"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import getVerseWords, { Word } from "@/utils/getVerseWords";

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
export default function SimilarWordsTable({
  wordGroup,
  translation_id,
}: {
  wordGroup: string[];
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
  const table = useReactTable({
    data: wordGroup,
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
}

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
          <div className="text-2xl text-center">
            {/* ARABIC */}
            {sentence.map((word, index) => {
              if (word.char_type_name !== "word") return "";
              if (index == +verse_key.split(":")[2] - 1)
                return (
                  <>
                    <div className="inline text-green-500"> {word.text} </div>
                  </>
                );
              return <> {word.text} </>;
            })}
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
