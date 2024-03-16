"use client";
import getProgresses from "@/utils/getProgresses";
import React, { useEffect, useState } from "react";
import MCQ from "@/components/MCQ";
import LoadingScreen from "@/components/ui/LoadingScreen";
import getOptions from "@/utils/getOptions";
import setProgressesInDB from "@/utils/setProgress";
import Link from "next/link";
import GotoDashboard from "@/components/GotoDashboard";
import getToReview, { ToReview } from "../../dashboard/getToReview";
import { Tables } from "@/database.types";
import getPreference from "@/utils/getPreference";
import getCollections from "./getCollections";
import { Progress } from "@/utils/getProgress";

type PreferenceState = [
  intervals: { [key: number]: number } | undefined,
  translation_id: number | undefined,
];

export default function Page({
  params: { number },
}: {
  params: { number: number };
}) {
  const [collections, setCollections] = useState<{
    [key: number]: `${string}:${string}:${string}`[][];
  }>();
  const [progresses, setProgresses] = //
    useState<{ [key: number]: Tables<"user_progress"> } | undefined | null>(
      undefined
    );
  const [[intervals, translation_id], setPreference] =
    useState<PreferenceState>([undefined, undefined]);
  const [options, setOptions] = useState<`${string}:${string}:${string}`[]>();
  const [toReview, setToReview] = useState<ToReview>();
  const [McqData, setMcqData] = useState<
    {
      wordGroup: `${string}:${string}:${string}`[];
      progressID: number;
      collectionID: number;
      wordID: number;
    }[]
  >();
  //set Progresses
  useEffect(() => {
    getProgresses().then(setProgresses);
    return () => {};
  }, []);
  useEffect(() => {
    progresses && getToReview(progresses).then(setToReview);
  }, [progresses]);

  //set Collections
  useEffect(() => {
    if (!toReview) return;
    const idArr = toReview.map((l) => l.collectionId);
    getCollections(idArr).then(setCollections);
    return () => {};
  }, [toReview]);

  //set McqData
  useEffect(() => {
    if (McqData) return;
    if (!(toReview && collections && progresses)) return;
    const data: {
      wordGroup: `${string}:${string}:${string}`[];
      progressID: number;
      collectionID: number;
      wordID: number;
    }[] = [];
    for (const i of toReview) {
      const progressID = progresses[i.collectionId].id;
      for (const wordID of i.toReview) {
        if (data.length == number) {
          break;
        }
        data.push({
          wordGroup: collections[i.collectionId][wordID],
          progressID,
          wordID,
          collectionID: i.collectionId,
        });
      }
    }
    setMcqData(data);
  }, [collections, toReview, progresses, number, McqData]);

  //set Options
  useEffect(() => {
    McqData?.length
      ? McqData && getOptions(McqData[0].wordGroup).then(setOptions)
      : setOptions([]);
    return () => {};
  }, [McqData]);

  // set preference
  useEffect(() => {
    getPreference().then(({ intervals, translation_id }) =>
      setPreference([intervals, translation_id] as PreferenceState)
    );
    return () => {};
  }, []);

  function callback(correct: boolean) {
    if (!(McqData && intervals && progresses)) {
      return alert("Error");
    }
    let percentage: number;

    // filtering to get the progress of the current collection
    const { wordID, collectionID, progressID } = McqData[0];
    const progress = progresses[collectionID].progress as Progress;
    // if correct increase progresses
    if (correct) {
      const currentProgresses = progress[wordID].percentage ?? 0;
      percentage = getNextProgress(intervals, currentProgresses);
      McqData.shift();
    } else {
      // else set progresses to 0
      percentage = 0;
      // removing the first value
      McqData.push(McqData.shift()!);
    }

    const newProgress: Progress = {};
    Object.assign(newProgress, progress);
    newProgress[wordID] = {
      percentage,
      updatedOn: new Date().toISOString(),
    };
    progresses[collectionID].progress = newProgress;
    setProgresses({ ...progresses });
    setProgressesInDB({
      progressID: progressID,
      collectionID: collectionID,
      progress: newProgress,
    });
    setMcqData([...McqData]);
    setOptions(undefined);
  }
  console.log({
    collections,
    toReview,
    McqData,
    options,
  });

  return (
    <>
      <GotoDashboard />
      <div className="text-xl cursor-not-allowed inline-block p-2 border">
        {McqData?.length} more to go {"=>"}
      </div>
      {options && translation_id && intervals ? (
        McqData?.length ? (
          <MCQ
            {...{
              ...McqData[0],
              options,
              callback,
              translation_id,
            }}
          />
        ) : (
          <></>
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
