"use client";
import React, { useEffect, useState } from "react";
import MCQ from "@/components/MCQ";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { Tables } from "@/database.types";
import getToReview from "@/utils/getToReview";
import ReviewBtn from "@/components/ReviewBtn";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page({
  params: { number },
}: {
  params: { number: string };
}) {
  const [name, setName] = useState<string>();
  const [wordGroups, setWordGroups] = useState<Tables<"word_groups">[]>();
  const [toReviewCount, setToReviewCount] = useState<number>(0);
  //set wordGroups
  useEffect(() => {
    getToReview().then((wordGroups) => {
      setWordGroups(wordGroups.slice(0, +number));
      setToReviewCount(wordGroups.length);
    });
    return () => {};
  }, [number]);

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
              {" "}
              <div className="flex-grow grid place-items-center">
                <div>
                  <div>
                    Round Complete.
                    {toReviewCount - +number > 0
                      ? toReviewCount - +number
                      : 0}{" "}
                    left to review.
                    {toReviewCount - +number && (
                      <>
                        {" "}
                        <ReviewBtn /> them?
                      </>
                    )}
                  </div>
                  <div>
                    {toReviewCount - +number ? "Or go to " : "Go to "}
                    <Button size={"sm"} variant={"secondary"}>
                      <Link href={"/dashboard"}>dashboard</Link>
                    </Button>{" "}
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
