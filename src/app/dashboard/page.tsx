"use client";

import Collections from "@/components/Collections";
import Review from "./Review";
import Count from "./Count";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/clients";
import { Database } from "@/database.types";
import getToReviewIds from "@/utils/getToReviewIds";

export default function PrivatePage() {
  const [wordGroups, setWordGroups] = useState<
    { id: number; words: string[]; collection_id: number }[]
  >([]);
  const [progressArr, setProgressArr] = useState<
    | {
        progress: number;
        word_group_id: number;
        updated_at: string;
        word_groups: {
          collection_id: number;
          id: number;
        } | null;
      }[]
    | null
  >([]);
  const supabase = createClient<Database>();
  const [toReviewCount, setToReviewCount] = useState(0);

  useEffect(() => {
    supabase
      .from("word_groups")
      .select("id,words,collection_id ")
      .limit(10000)
      .then(({ error, data }) => {
        if (error || !data) {
          console.log(error);
        } else {
          setWordGroups(data);
        }
      });
  }, [supabase]);
  useEffect(() => {
    supabase
      .from("user_progress")
      .select(
        "progress,word_group_id,updated_at,word_groups(collection_id, id)"
      )
      .then(({ error, data }) => {
        if (error || !data) {
          console.log(error);
        } else {
          setProgressArr(data);
        }
      });
  }, [supabase, wordGroups]);
  useEffect(() => {
    progressArr &&
      getToReviewIds(progressArr).then((ids) => setToReviewCount(ids.length));

    return () => {};
  }, [progressArr]);
  return (
    <>
      <div className="grid grid-cols-2 w-full">
        <Count />
        <Review {...{ toReviewCount }} />
      </div>
      <Collections {...{ wordGroups, progressArr }} />
    </>
  );
}
