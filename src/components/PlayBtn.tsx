import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import Link from "@/components/ui/Link";
import { createClient } from "@/utils/supabase/clients";
import { Database, Tables } from "@/database.types";

export default function Learn({
  className,
  collection_id,
  size,
}: {
  className?: string;
  collection_id: number;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
}) {
  const [number, setNumber] = useState<number>(10);
  const supabase = createClient<Database>();
  const [wordGroupsCount, setWordGroupsCount] = useState<number | null>();

  useEffect(() => {
    supabase
      .rpc("get_0_word_groups", { collection_id }, { count: "exact" })
      .select("")
      .then(({ error, count }) => {
        if (error || !count) {
          console.log(error);
        } else {
          if (count < 10) {
            setNumber(count);
          }
        }
        setWordGroupsCount(count);
      });
    return () => {};
  }, [collection_id, number, supabase]);

  return (
    <>
      <Dialog>
        <DialogTrigger className={cn(className)} asChild>
          <Button disabled={!wordGroupsCount} size={size ?? "sm"}>
            {wordGroupsCount != undefined ? "Play" : "loading"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Play</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2">
            <div className="">sentences per round:</div>
            <Input
              className="w-20"
              min={1}
              max={wordGroupsCount ?? 0}
              type="number"
              value={number}
              onChange={(e) => setNumber(Number(e.target.value))}
            />
          </div>

          <Link href={`/play/${collection_id}/${number}`}>
            <Button className="w-fit ml-auto">Start </Button>
          </Link>
        </DialogContent>
      </Dialog>
    </>
  );
}
