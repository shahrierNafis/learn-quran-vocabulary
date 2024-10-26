import Link from "@/components/ui/Link";
import { Database, Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/clients";
import React, { useEffect, useState } from "react";
import PlayBtn from "@/components/PlayBtn";
import { Button } from "./ui/button";
import CollectionProgress from "./CollectionProgress";
import ReviewBtn from "./ReviewBtn";
import getToReviewIds from "@/utils/getToReviewIds";
export default function Collection({
  collection,
  wordGroups,
  progressArr,
}: {
  collection: Tables<"collections">;
  wordGroups: {
    id: number;
    words: string[];
  }[];
  progressArr:
    | {
        progress: number;
        word_group_id: number;
        updated_at: string;
        word_groups: {
          collection_id: number;
          id: number;
        } | null;
      }[]
    | null;
}) {
  const [toReviewCount, setToReviewCount] = useState(0);
  useEffect(() => {
    progressArr &&
      getToReviewIds(progressArr).then((ids) => setToReviewCount(ids.length));

    return () => {};
  }, [progressArr]);

  return (
    <>
      <div className="flex items-center min-w-screen max-w-screen-lg mx-auto">
        <div className="text-3xl hidden md:block">‣</div>
        <div className="p-2 flex m-2 border border-input bg-background justify-around flex-grow">
          <div className="max-w-screen-md">
            <h1 className="text-2xl">{collection.name}</h1>
            <p className="">{collection.description}</p>
          </div>
          <div className="flex grow space-y-2 my-auto flex-col justify-center items-center">
            <CollectionProgress {...{ progressArr, wordGroups }} />
            <div className="flex md:space-x-2 md:space-y-0 space-y-2 flex-col md:flex-row">
              <Link className="flex" href={`/collection/${collection.id}`}>
                <Button className="grow" size={"sm"}>
                  Manage{" "}
                </Button>
              </Link>

              <PlayBtn
                {...{
                  wordGroupsCount: progressArr
                    ? wordGroups.length -
                      progressArr?.filter((p) => p.progress != 0).length
                    : 0,
                  collection_id: collection.id,
                }}
              />
              <ReviewBtn {...{ collection_id: collection.id, toReviewCount }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
