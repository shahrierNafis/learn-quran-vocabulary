"use client";
import React, { useEffect, useState } from "react";
import MCQ from "@/components/MCQ";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { Database, Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/clients";
import PlayBtn from "@/components/PlayBtn";
import Link from "@/components/ui/Link";
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
      setWordGroups((prev) => {
        if (prev) {
          return prev.slice(1);
        }
      });
    } else {
      // else set progress to 0
      setWordGroups((prev) => {
        if (prev) {
          const newArr = [...prev];
          newArr.push(newArr.shift()!);
          return newArr;
        }
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
                    <Link href={"/dashboard"}>
                      <Button size={"sm"} variant={"secondary"}>
                        dashboard
                      </Button>
                    </Link>
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
