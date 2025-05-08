import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
type ScoreStore = {
  score: number;
  setScore: (score: number) => void;
  addScore: (score: number) => void;
};

export const useScoreStore = create<ScoreStore>()(
  persist(
    (set, get) => ({
      score: 0, // initial state
      setScore: (score: number) => set({ score }),
      addScore: (score: number) => {
        set((state) => ({
          score: state.score + score,
        }));
      },
    }),
    {
      name: "scoreStorage", // name of the item in the storage (must be unique)
    }
  )
);

export default function Score() {
  const [score, setScore] = useScoreStore(
    useShallow((state) => [state.score, state.setScore])
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant={"outline"}> Score: {score}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset Score?</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => setScore(0)}>
            Reset
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
