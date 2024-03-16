"use client";
import getProgress, { Progress } from "@/utils/getProgress";
import getCollection from "@/utils/getCollection";
import React, { useEffect, useState } from "react";
import getIndexArr from "./getIndexArr";
import MCQ from "@/components/MCQ";
import LoadingScreen from "@/components/ui/LoadingScreen";
import getOptions from "@/utils/getOptions";
import getPreference from "../../../../utils/getPreference";
import setProgressInDB from "@/utils/setProgress";
import Link from "next/link";
import GotoDashboard from "@/components/GotoDashboard";

type ProgressState = [Progress | undefined | null, number | undefined | null];
type PreferenceState = [
  intervals: { [key: number]: number } | undefined,
  translation_id: number | undefined,
];

export default function Page({
  params: { id, number },
}: {
  params: { id: string; number: string };
}) {
  const [name, setName] = useState<string>();
  const [collection, setCollection] =
    useState<`${string}:${string}:${string}`[][]>();
  const [[progress, progressID], setProgress] = //
    useState<ProgressState>([undefined, undefined]);
  const [[intervals, translation_id], setPreference] =
    useState<PreferenceState>([undefined, undefined]);
  const [IndexArr, setIndexArr] = useState<number[]>();
  const [options, setOptions] = useState<`${string}:${string}:${string}`[]>();

  //set Collection
  useEffect(() => {
    getCollection(+id).then(({ name, collection }) => {
      setCollection(collection as []);
      setName(name);
    });
    getProgress(id).then(({ progress, progressId }) => {
      setProgress([progress as Progress, progressId]);
    });
    return () => {};
  }, [id]);

  //set wordGroups
  useEffect(() => {
    collection &&
      progress !== undefined &&
      progressID !== undefined &&
      IndexArr == undefined &&
      getIndexArr({
        collection,
        progressID,
        number: +number,
        progress: progress ?? {},
        id,
      }).then(setIndexArr);
    return () => {};
  }, [collection, progressID, number, progress, id, IndexArr]);

  //set Options
  useEffect(() => {
    IndexArr?.length
      ? collection && getOptions(collection[IndexArr[0]]).then(setOptions)
      : setOptions([]);
    return () => {};
  }, [IndexArr, collection]);
  // set preference
  useEffect(() => {
    getPreference().then(({ intervals, translation_id }) =>
      setPreference([intervals, translation_id] as PreferenceState)
    );
    return () => {};
  }, []);

  function callback(correct: boolean) {
    if (!(IndexArr && intervals && progress !== undefined)) {
      return alert("Error");
    }
    let percentage: number;
    const index = IndexArr[0];
    // if correct increase progress
    if (correct) {
      const currentProgress = progress ? progress[index]?.percentage : 0;
      percentage = getNextProgress(intervals, currentProgress);
      IndexArr.shift();
    } else {
      // else set progress to 0
      percentage = 0;
      IndexArr.push(IndexArr.shift()!);
    }
    const newProgress: Progress = {};
    Object.assign(newProgress, progress);
    newProgress[index] = {
      percentage,
      updatedOn: new Date().toISOString(),
    };
    setProgressInDB({
      progressID,
      collectionID: +id,
      progress: newProgress,
    }).then(setProgress);
    setIndexArr([...IndexArr]);
    setOptions(undefined);
  }

  return (
    <>
      <div className="text-xl inline-block p-2 border">
        <Link href={`/collection/${id}`}>{"<= Collection"}</Link>
      </div>
      <GotoDashboard />
      <div className="text-xl cursor-not-allowed inline-block p-2 border">
        {IndexArr?.length} more to go {"=>"}
      </div>
      {collection && IndexArr && options && translation_id && intervals ? (
        IndexArr?.length ? (
          <MCQ
            {...{
              wordGroup: collection[IndexArr[0]],
              options,
              callback,
              translation_id,
            }}
          />
        ) : (
          <>
            No words to learn. go Back to{" "}
            <Link
              className="text-blue-400 underline"
              href={`/collection/${id}`}
            >
              Collection
            </Link>
            .
          </>
        )
      ) : (
        <>
          <LoadingScreen />
        </>
      )}
    </>
  );
}

function getNextProgress(
  interval: { [key: number]: number },
  currentProgress?: number
) {
  const steps = Object.keys(interval).sort((a, b) => +a - +b);
  for (const step of steps) {
    if (+step > (currentProgress ?? 0)) {
      return +step;
    }
  }
  return (currentProgress ?? 0) + 25;
}
