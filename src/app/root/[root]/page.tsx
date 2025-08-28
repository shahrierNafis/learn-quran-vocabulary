"use client";
import React, { memo, use, useEffect, useMemo, useState } from "react";
import { DataTable } from "./data-table";
import getRootData from "@/utils/getRootData";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronRight, ChevronDown } from "lucide-react";
import { buckwalterToArabic } from "@/utils/arabic-buckwalter-transliteration";
import useFont from "@/utils/useFont";
import { cn } from "@/lib/utils";
import CellComponent from "@/components/CellComponent";
import { useOnlineStorage } from "@/stores/onlineStorage";
import { useShallow } from "zustand/react/shallow";
export type TableData = {
  lemma: string;
  positions: string[];
};

export default function Page(props: { params: Promise<{ root: string }> }) {
  const params = use(props.params);
  const { root } = params;
  const translation_ids = useOnlineStorage(useShallow((a) => a.translation_ids));

  const [rootData, setRootData] = useState<
    {
      lemma: string;
      positions: string[];
    }[]
  >([]);

  useEffect(() => {
    getRootData(decodeURIComponent(root))
      .then((rd) => {
        return Object.entries(rd).map(([lemma, positions]) => ({
          lemma,
          positions,
        }));
      })
      .then(setRootData);

    return () => {};
  }, [root]);
  const columns: ColumnDef<TableData>[] = useMemo(
    () => [
      {
        accessorFn: (originalRow: TableData) => {
          return originalRow.lemma;
        },

        id: "lemma",
        header: () => <div className="text-center">Lemma</div>,
        cell: function Cell({ row, getValue }) {
          "use client";
          const [font] = useFont();
          return (
            <>
              <div className={`flex items-center justify-center gap-2`} style={{ paddingLeft: `${row.depth * 2}rem` }} key={row.id}>
                <>
                  {row.getCanExpand() ? (
                    <button className="cursor-pointer" onClick={row.getToggleExpandedHandler()}>
                      {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
                    </button>
                  ) : (
                    <ChevronRight className="opacity-25" />
                  )}
                  <div className={cn(font?.className, "text-3xl")}>{row.depth == 0 && buckwalterToArabic((getValue() as string) ?? "")}</div>
                </>
              </div>
            </>
          );
        },
      },
      {
        accessorFn: (originalRow: TableData, index: number) => {
          return originalRow.positions[0];
        },
        id: "verse",
        header: () => <div className="text-center">verse</div>,
        cell: memo(
          function Cell({ getValue }) {
            return (
              <>
                <div className="flex gap-1 flex-col">
                  <div className="text-xs text-center text-gray-400">{getValue() as string}</div>
                  <CellComponent
                    {...{
                      translation_ids,
                      verse_key: getValue() as `${string}:${string}${string}`,
                    }}
                  />
                </div>
              </>
            );
          },
          (prev, next) => prev.getValue() == next.getValue()
        ),
      },
    ],
    [translation_ids]
  );
  return (
    <>
      {rootData && (
        <DataTable
          {...{
            columns,
            data: rootData,
          }}
        />
      )}
    </>
  );
}
