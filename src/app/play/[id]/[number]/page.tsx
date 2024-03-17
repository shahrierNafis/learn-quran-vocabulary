"use client";
import React, { useEffect, useState } from "react";
import MCQ from "@/components/MCQ";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { Database, Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/clients";
import PlayBtn from "@/components/PlayBtn";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page({
  params: { id, number },
}: {
  params: { id: string; number: string };
}) {
  const [name, setName] = useState<string>();
  const [wordGroups, setWordGroups] = useState<Tables<"word_groups">[]>();
  const supabase = createClient<Database>();
  //set wordGroups
  useEffect(() => {
    supabase
      .rpc("get_0_word_groups", { collection_id: +id })
      .limit(+number)
      .then(({ data, error }) => {
        if (error) {
          console.log(error);
        } else {
          setWordGroups(data);
        }
      });
    return () => {};
  }, [id, number, supabase]);

  async function callback(correct: boolean) {
    if (!wordGroups) {
      return alert("Error");
    }
    // if correct increase progress
    if (correct) {
      setWordGroups((prev) => prev?.slice(1));
    } else {
      // else set progress to 0
      setWordGroups((prev) => {
        prev?.push(prev.shift()!);
        return prev;
      });
    }
  }

  return (
    <>
      <div className="min-h-dvh flex flex-col">
        {wordGroups !== undefined ? (
          wordGroups?.length ? (
            <MCQ
              {...{
                wordGroups,
                callback,
              }}
            />
          ) : (
            <>
              <div className="flex-grow grid place-items-center">
                <div>
                  <div>
                    Round Complete.
                    <PlayBtn {...{ id }} /> again?
                  </div>
                  <div>
                    Or go to{" "}
                    <Button size={"sm"} variant={"secondary"}>
                      <Link href={"/dashboard"}>dashboard</Link>
                    </Button>
                    ?
                  </div>
                </div>
              </div>
            </>
          )
        ) : (
          <>
            <LoadingScreen />
          </>
        )}
      </div>
    </>
  );
}
