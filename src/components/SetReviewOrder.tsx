"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/utils/cn";
import { usePreferenceStore } from "@/stores/preference-store";
import { useShallow } from "zustand/react/shallow";

export function SetReviewOrder({ className }: { className?: string }) {
  const [reviewOrder, setReviewOrder] = usePreferenceStore(
    useShallow((state) => [state.reviewOrder, state.setReviewOrder])
  );

  React.useEffect(() => {
    usePreferenceStore.persist.rehydrate();
    return () => {};
  }, []);
  return (
    <div className={cn(className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex flex-col items-center justify-center border p-2">
            <div>Play review sentences ordered by</div>
            <Button
              className="flex grow justify-center gap-2 flex-col"
              variant="outline"
            >
              <div>{obj[reviewOrder]}</div>
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {Object.entries(obj).map(([key, value]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => setReviewOrder(key as any)}
            >
              {value}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
const obj = {
  "next_review ASC": "due date, oldest first",
  "next_review DESC": "due date, most recent first",
  "level ASC": "percent mastered, 0% first",
  "level DESC": "percent mastered, 100% first",
  random: "random",
};
