import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Database, Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/clients";
import React, { useEffect, useState } from "react";

export default function Count() {
  const [progressArr, setProgressArr] = useState<Tables<"user_progress">[]>([]);
  const supabase = createClient<Database>();
  useEffect(() => {
    supabase
      .from("user_progress")
      .select("*")
      .then(({ data }) =>
        setProgressArr(
          data?.filter((progress) => {
            const updated_at = new Date(progress.updated_at);
            const today = new Date();
            return (
              updated_at.getFullYear() +
                "-" +
                updated_at.getMonth() +
                "-" +
                updated_at.getDate() ===
              today.getFullYear() +
                "-" +
                today.getMonth() +
                "-" +
                today.getDate()
            );
          }) ?? []
        )
      );
    return () => {};
  }, [supabase]);

  return (
    <>
      {" "}
      <Dialog>
        <DialogTrigger className="grow w-full">
          <div className="flex flex-col w-full flex-grow basis-0 justify-center items-center">
            <div>{progressArr.length} words learned</div>
            <div>today</div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Todays progress</DialogTitle>
            <DialogDescription>
              <div
                style={{ gridTemplateColumns: "auto 1fr" }}
                className="md:w-[75%] mx-auto grow grid-cols-2 w-full text-nowrap text-xs text-gray-500 grid"
              >
                {Object.entries(count(progressArr)).map(([progress, count]) => {
                  return (
                    <>
                      {" "}
                      <div className="text-nowrap text-end">
                        {progress}% mastered:
                      </div>
                      <div className="text-end">{count} words</div>
                    </>
                  );
                })}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
function count(progressArr: Tables<"user_progress">[]) {
  const obj: { [key: number]: number } = {};
  progressArr.forEach((p) => {
    obj[p.progress] = (obj[p.progress] ?? 0) + 1;
  });
  return obj;
}
