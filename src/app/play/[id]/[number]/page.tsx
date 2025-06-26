"use client";
import React, { useEffect, useState, use } from "react";
import Round from "@/components/Round";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { Database, Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/clients";
import PlayBtn from "@/components/PlayBtn";
import Link from "@/components/ui/Link";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

export default function Page(props: {
  params: Promise<{ id: string; number: string }>;
}) {
  const params = use(props.params);

  const { id, number } = params;

  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const skill = searchParams.get("skill");

  const [wordGroups, setWordGroups] = useState<Tables<"word_groups">[]>();
  const [count, setCount] = useState(0);
  const supabase = createClient<Database>();
  //set wordGroups
  useEffect(() => {
    supabase
      .rpc("get_0_word_groups", { collection_id: +id }, { count: "exact" })
      .limit(+number)
      .then(({ data, error, count }) => {
        if (error) {
          console.log(error);
        } else {
          setCount(count ?? 0);
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
            <Round
              {...{
                wordGroups,
                callback,
                textInput: mode == "text_input",
                listen: skill == "listening",
              }}
            />
          ) : (
            <>
              <div className="flex-grow grid place-items-center">
                <div>
                  <div>
                    Round Complete.
                    {!!(count - +number) && (
                      <div className="inline">
                        <PlayBtn {...{ collection_id: +id }} /> again?
                      </div>
                    )}
                  </div>
                  <div>
                    {!!(count - +number) && <div className="inline"> Or</div>}{" "}
                    go to{" "}
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
