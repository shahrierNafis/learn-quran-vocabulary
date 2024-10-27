"use client";
import React, { useEffect, useState, use } from "react";
import MCQ from "@/components/MCQ";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { Tables } from "@/database.types";
import getToReview from "@/utils/getToReview";
import ReviewBtn from "@/components/ReviewBtn";
import { Button } from "@/components/ui/button";
import Link from "@/components/ui/Link";
import { useSearchParams } from "next/navigation";

export default function Page(props: { params: Promise<{ number: string }> }) {
  const params = use(props.params);

  const { number } = params;

  const [wordGroups, setWordGroups] = useState<Tables<"word_groups">[]>();
  const [toReviewCount, setToReviewCount] = useState<number>(0);
  const searchParams = useSearchParams();
  const collection_id = searchParams.get("collection_id");

  //set wordGroups
  useEffect(() => {
    getToReview(collection_id ? +collection_id : undefined).then(
      (wordGroups) => {
        setWordGroups(wordGroups.slice(0, +number));
        setToReviewCount(wordGroups.length);
      }
    );
    return () => {};
  }, [collection_id, number]);

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
                    {!!(toReviewCount - +number) && (
                      <>
                        {" "}
                        <ReviewBtn /> them?
                      </>
                    )}
                  </div>
                  <div>
                    {!!(toReviewCount - +number) ? "Or go to " : "Go to "}
                    <Link href={"/dashboard"}>
                      <Button size={"sm"} variant={"secondary"}>
                        dashboard{" "}
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
