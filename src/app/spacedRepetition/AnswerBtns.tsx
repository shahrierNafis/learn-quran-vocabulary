import { Button } from "@/components/ui/button";
import { useOnlineStorage } from "@/stores/onlineStorage";
import { useShallow } from "zustand/react/shallow";
import React from "react";
import { RatingType, Rating, IPreview, RecordLogItem } from "ts-fsrs";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import MotionDiv from "@/components/MotionDiv";

export default function AnswerBtns({
  schedulingCards,
  now = Date.now(),
  wordLemma,
  onClick = () => {},
  className,
}: {
  schedulingCards: IPreview;
  now: number;
  wordLemma: string;
  onClick?: () => void;
  className?: string;
}) {
  const [updateCard] = useOnlineStorage(useShallow((a) => [a.updateCard]));

  return (
    <>
      <div className={cn("flex gap-2 items-center justify-center w-full", className)}>
        {schedulingCards &&
          (["Again", "Hard", "Good", "Easy"] as RatingType[]).map((i: RatingType) => {
            return (
              <>
                <MotionDiv key={i}>
                  <div key={i} className="flex flex-col items-center justify-center gap-1 ">
                    <div>{msToAppropriateUnits((schedulingCards[Rating[i] as keyof IPreview] as RecordLogItem).card.due.getTime() - now)}</div>
                    <Button
                      variant={"outline"}
                      className="rounded-full px-4"
                      onClick={() => {
                        onClick();
                        updateCard(wordLemma, (schedulingCards[Rating[i] as keyof IPreview] as RecordLogItem).card);
                      }}
                    >
                      {i}
                    </Button>
                  </div>
                </MotionDiv>
              </>
            );
          })}
      </div>{" "}
    </>
  );
}
function msToAppropriateUnits(ms: number) {
  const units = [
    { label: "y", ms: 1000 * 60 * 60 * 24 * 365 },
    { label: "mo", ms: 1000 * 60 * 60 * 24 * 30 },
    { label: "d", ms: 1000 * 60 * 60 * 24 },
    { label: "h", ms: 1000 * 60 * 60 },
    { label: "m", ms: 1000 * 60 },
    { label: "s", ms: 1000 },
  ];

  for (const unit of units) {
    if (ms >= unit.ms) {
      const value = Math.round((ms / unit.ms) * 10) / 10;
      return `${value} ${unit.label}`;
    }
  }

  return `${ms} ms`; // fallback for very small values
}
