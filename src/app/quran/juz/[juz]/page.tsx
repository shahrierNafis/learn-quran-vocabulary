"use client";
import React, { memo, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import { DataTablePagination } from "@/components/ui/DataTablePagination";
import getJuzData from "./getJuzData";
import CellComponent from "@/components/CellComponent";
import { usePreferenceStore } from "@/stores/preference-store";
import { useShallow } from "zustand/react/shallow";
import Header from "../../Header";

export default function Page({ params: { juz } }: { params: { juz: number } }) {
  const router = useRouter();
  const translation_ids = usePreferenceStore(
    useShallow((state) => state.translation_ids)
  );
  const columns: ColumnDef<string, string>[] = [
    {
      accessorFn: (index) => index,
      header: "Index",
    },
    {
      accessorFn: (index: string): string => index,
      header: "verse",
      cell: memo(
        function Cell({ getValue }) {
          if (getValue().startsWith("surah")) {
            return <Header surah={+getValue().split(" ")[1]} />;
          }
          return (
            <>
              {" "}
              <CellComponent
                {...{
                  translation_ids,
                  verse_key: getValue(),
                }}
              />
            </>
          );
        },
        (prev, next) => prev.getValue() == next.getValue()
      ),
    },
  ];
  const [data, setData] = useState<string[]>([]);
  useEffect(() => {
    getJuzData(juz).then(setData);
    return () => {};
  }, [juz]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  if (!juz || juz > 30) {
    return <>Error 404</>;
  }
  return (
    <>
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
    </>
  );
}
