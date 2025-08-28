"use client";
import { useOnlineStorage } from "@/stores/onlineStorage";
import { useShallow } from "zustand/react/shallow";
import React, { useEffect } from "react";
import StudyDialog from "./studyDialog";
import BrowseDialog from "./BrowseDialog";
import { createEmptyCard } from "ts-fsrs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    useOnlineStorage.persist.rehydrate();
  }, []);
  const [wordList] = useOnlineStorage(useShallow((a) => [a.wordList]));
  const [updateCard, maximumInterval, setMaximumInterval] = useOnlineStorage(useShallow((a) => [a.updateCard, a.maximumInterval, a.setMaximumInterval]));
  let newWords = 0;
  let learning = 0;
  let review = 0;
  let relearning = 0;
  let studiedToday = 0;

  for (const [lemma, word] of Object.entries(wordList)) {
    if (word.isSuspended) {
      continue;
    }
    if (!word.card.due) {
      updateCard(lemma, createEmptyCard());
    }
    if (word.card.last_review && word.card.last_review.toDateString() === new Date().toDateString()) studiedToday++;
    switch (word.card.state) {
      case 0:
        newWords++;
        break;
      case 1:
        learning++;
        break;
      case 2:
        if (word.card.due.toDateString() === new Date().toDateString()) review++;
        break;
      case 3:
        relearning++;
        break;
    }
  }

  return (
    <div className="w-full flex justify-center gap-32 sm:gap-4 items-center my-auto h-[100vh]  sm:flex-row flex-col ">
      <div className="grid grid-cols-2 justify-items-start gap-2 sm:border-0 border">
        <div>New:</div> <div className="text-blue-500 font-bold">{newWords}</div>
        <div>Learning:</div> <div className="text-red-500 font-bold">{learning}</div>
        <div>To Review:</div> <div className="text-green-500 font-bold">{review}</div>
        <div>Relearning:</div> <div className="text-yellow-500 font-bold">{relearning}</div>
        <div>Studied Today:</div> <div className="font-bold">{studiedToday}</div>
      </div>
      <div className="">
        <div className="flex justify-around gap-4">
          <StudyDialog {...{ wordList }} />
          <BrowseDialog {...{ wordList }} />
        </div>
        <Label>
          Maximum interval
          <Input type="number" value={maximumInterval} onInput={(event) => setMaximumInterval(Math.abs(+event.currentTarget.value))} placeholder="Maximum interval"></Input>
        </Label>
      </div>
    </div>
  );
}
