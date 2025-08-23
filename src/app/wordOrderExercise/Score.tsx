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
import { useShallow } from "zustand/react/shallow";
import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import { androidstudio } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useOnlineStorage } from "@/stores/onlineStorage";

export default function Score() {
  const [score, setScore] = useOnlineStorage(
    useShallow((state) => [state.WOEscore, state.setWOEscore])
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant={"outline"}> Score: {Math.round(score)}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-fit">
        <AlertDialogHeader>
          <AlertDialogTitle>Reset Score?</AlertDialogTitle>
          <AlertDialogDescription>
            <SyntaxHighlighter
              wrapLongLines
              language="mathematica"
              style={androidstudio}
            >
              (penalty ? (verse.length * (extraWordsPerWord/2+1))**2 :
              verse.length * (extraWordsPerWord/2+1))
            </SyntaxHighlighter>
            <br />
            If penalty is turned on Score is squared [(verse.length *
            (extraWordsPerWord/2+1))**2]. Or else just [verse.length *
            (extraWordsPerWord/2+1)] is the score.
          </AlertDialogDescription>
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
