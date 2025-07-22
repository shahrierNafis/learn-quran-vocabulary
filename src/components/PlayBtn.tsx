import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import Link from "@/components/ui/Link";
import { Checkbox } from "./ui/checkbox";
import { useShallow } from "zustand/react/shallow";
import { useLocalStorage } from "@/stores/localStorage";
import { Label } from "./ui/label";

export default function PlayBtn({
  children,
  type,
  className, collection_id
}: {
  children: React.ReactNode,
  type: "review" | "play",
  className?: string; collection_id?: number

}) {
  useEffect(() => { useLocalStorage.persist.rehydrate() }, [])
  const [versesPerRound, setVersesPerRound, mode, setMode, skill, setSkill] = useLocalStorage(
    useShallow((state) => [state.versesPerRound, state.setVersesPerRound, state.mode, state.setMode, state.skill, state.setSkill])
  );
  return (
    <>
      <Dialog>
        <DialogTrigger className={cn(className)} asChild>
          {children}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <div className="">verses per round:</div>
            <Input
              className="w-20"
              min={1}
              type="number"
              value={versesPerRound}
              onChange={(e) => setVersesPerRound(Number(e.target.value))}
            />
          </div>

          <Label className="flex items-center gap-2"> <Checkbox checked={mode === "textInput"} onCheckedChange={(textInput) => setMode(textInput ? "textInput" : "")} /> text Input (hard)</Label>
          <Label className="flex items-center gap-2"> <Checkbox checked={skill === "listening"} onCheckedChange={(listening) => setSkill(listening ? "listening" : "")} /> learn listening skill</Label>
          <Link
            href={`/${type}/${versesPerRound}?collection_id=${collection_id ?? ""}&mode=${mode}&skill=${skill}`}
          >
            <Button className="w-fit ml-auto">Start</Button>
          </Link>
        </DialogContent>
      </Dialog>
    </>
  );
}
