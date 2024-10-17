"use client";
import React, { memo, useEffect, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";

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
import { DataTablePagination } from "./ui/DataTablePagination";
import { Tables } from "@/database.types";
import CellComponent from "./CellComponent";

export default memo(
  function SimilarWordsTable({
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
        cell: memo(
          function Cell({ getValue }) {
            return (
              <CellComponent
                {...{
                  translation_ids,
                  verse_key: getValue() as `${string}:${string}${string}`,
                }}
              />
            );
          },
          (prev, next) => prev.getValue() == next.getValue()
        ),
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <DataTablePagination table={table} />
      </div>
    );
  },
  (prev, next) =>
    prev.wordGroup.words.every((e, i) => next.wordGroup.words[i] == e) &&
    prev.translation_ids.every((e, i) => next.translation_ids[i] == e)
);
