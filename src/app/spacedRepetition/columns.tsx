"use client";

import { Button } from "@/components/ui/button";
import { useOnlineStorage } from "@/stores/onlineStorage";
import { buckwalterToArabic } from "@/utils/arabic-buckwalter-transliteration";
import { ColumnDef } from "@tanstack/react-table";
import { Card, createEmptyCard } from "ts-fsrs";
import AnswerBtns from "./AnswerBtns";
import { preconfiguredFsrs } from "./getFsrs";
import { ArrowUpDown } from "lucide-react";
import { simplifyArabic } from "@/components/TextInput";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type word = {
  card: Card;
  index: string;
  isSuspended: boolean;
  lemma: string;
};

export const columns: ColumnDef<word>[] = [
  {
    accessorKey: "index",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="mx-auto text-center" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Index
          <ArrowUpDown className="mx-auto text-center ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorFn: (row) => buckwalterToArabic(row.lemma) + simplifyArabic(buckwalterToArabic(row.lemma)),
    header: "lemma",
    cell: ({ row }) => {
      return <div className="mx-auto text-center text-2xl">{buckwalterToArabic(row.original.lemma)}</div>;
    },
  },
  {
    header: "reset",
    accessorKey: "reset",

    cell: ({ row }) => {
      return (
        <Button
          variant={"outline"}
          className="mx-auto text-center rounded-full"
          onClick={() => {
            useOnlineStorage.getState().updateCard(row.original.lemma, createEmptyCard());
          }}
        >
          Reset
        </Button>
      );
    },
  },
  {
    header: "Suspended",
    accessorKey: "isSuspended",

    cell: ({ row }) => {
      return (
        <Button
          variant={row.original.isSuspended ? "outline" : "destructive"}
          className="mx-auto text-center rounded-full"
          onClick={() => {
            useOnlineStorage.getState().toggleSuspend(row.original.lemma);
          }}
        >
          {row.original.isSuspended ? "Unsuspend" : " Suspend "}
        </Button>
      );
    },
  },
  {
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="mx-auto text-center" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          State
          <ArrowUpDown className="mx-auto text-center ml-2 h-4 w-4" />
        </Button>
      );
    },

    accessorKey: "card.state",
    cell: ({ row }) => (
      <>
        {row.original.card.state === 0 && <div className="mx-auto text-center text-blue-500">(new)</div>}
        {row.original.card.state === 1 && <div className="mx-auto text-center text-red-500">(learning)</div>}
        {row.original.card.state === 2 && <div className="mx-auto text-center text-green-500">(review)</div>}
        {row.original.card.state === 3 && <div className="mx-auto text-center text-yellow-500">(relearning)</div>}
      </>
    ),
  },
  {
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="mx-auto text-center" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Schedule
          <ArrowUpDown className="mx-auto text-center ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "card.scheduled_days",
    cell: ({ row }) => <div className="mx-auto text-center text-sm text-gray-500">scheduled in {row.original.card.scheduled_days} day/s</div>,
  },
  {
    header: "Proceed",
    accessorKey: "card.due",
    cell: ({ row }) => {
      return <AnswerBtns className="mx-auto text-center w-fit" {...{ card: row.original.card, now: row.original.card.due.getTime(), wordLemma: row.original.lemma }} />;
    },
  },
];
