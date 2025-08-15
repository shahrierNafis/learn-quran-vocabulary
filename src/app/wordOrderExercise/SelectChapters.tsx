import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useShallow } from "zustand/react/shallow";
import { useLocalStorage } from "@/stores/localStorage";
import _ from "lodash";
import { useOnlineStorage } from "@/stores/onlineStorage";
import getChapterLength from "./getChapterLength";
import { Edit } from "lucide-react";
export default function SelectChapters() {
  const [
    chapters,
    addChapter,
    VFSDialogOpen,
    removeChapter,
    setVFSDialogOpen,
    setChapters,
  ] = useLocalStorage(
    useShallow((state) => [
      state.chapters,
      state.addChapter,
      state.VFSDialogOpen,
      state.removeChapter,
      state.setVFSDialogOpen,
      state.setChapters,
    ])
  );
  const [WOEProgress, setWOEProgress] = useOnlineStorage(
    useShallow((state) => [state.WOEProgress, state.setWOEProgress])
  );
  const totalPercentage = (
    Array.from({ length: 114 }, (_, i) => i + 1).reduce(
      (previousValue: number, currentValue: number) => {
        return (
          previousValue +
          progressPercentage(currentValue) * getChapterLength(currentValue)
        );
      },
      0
    ) / 6236
  ).toFixed(2);
  return (
    <Dialog
      open={VFSDialogOpen}
      onOpenChange={(open) => setVFSDialogOpen(open)}
    >
      <DialogTrigger>
        <Button variant={"outline"}>
          chapters from {chapters.length} chapter/s
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <DialogTrigger>Select chapters</DialogTrigger>
          </DialogTitle>
          <DialogDescription className="overflow-y-auto max-h-[80vh]">
            <div className="flex items-center w-full gap-2 p-2">
              <Checkbox
                className="flex-grow-0"
                checked={_.isEqual(
                  chapters,
                  Array.from({ length: 114 }, (_, i) => i + 1)
                )}
                onCheckedChange={() => {
                  if (
                    _.isEqual(
                      chapters,
                      Array.from({ length: 114 }, (_, i) => i + 1)
                    )
                  ) {
                    setChapters([]); // remove all
                  } else {
                    setChapters(Array.from({ length: 114 }, (_, i) => i + 1)); // add all
                  }
                }}
              />{" "}
              <div className="relative flex items-center flex-grow ">
                <div
                  className="absolute z-0 h-full rounded-md bg-gradient-to-r from-zinc-50 to-zinc-300"
                  style={{
                    width: `${totalPercentage}%`,
                  }}
                ></div>
                <div className="z-10 flex justify-center w-full p-2">
                  All 114 surahs :
                </div>{" "}
                <div className="z-10 flex flex-col items-center justify-center w-full p-2 ">
                  iteration{" "}
                  {_.min(
                    Array.from({ length: 114 }, (_, i) => i + 1).map((i) => {
                      return getIterationNum(i);
                    })
                  )}
                </div>
                <div className="z-10 flex justify-center w-full p-2">
                  {totalPercentage}%
                </div>
              </div>
            </div>
            {Array.from({ length: 114 }, (_, i) => i + 1).map((chapter) => (
              <>
                <div className="flex items-center w-full gap-2 p-2">
                  <Checkbox
                    className="flex-grow-0"
                    checked={chapters.includes(chapter)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        addChapter(chapter);
                      } else {
                        removeChapter(chapter);
                      }
                    }}
                  />
                  <div className="relative flex items-center flex-grow ">
                    <div
                      className="absolute z-0 h-full rounded-md bg-gradient-to-r from-zinc-50 to-zinc-300"
                      style={{
                        width: `${progressPercentage(chapter)}%`,
                      }}
                    ></div>
                    <div className="z-10 flex justify-center w-full p-2">
                      surah {chapter}:
                    </div>
                    <div className="z-10 flex flex-col items-center w-full p-2">
                      <div> iteration {getIterationNum(chapter)}</div>
                      <div className="flex">
                        {WOEProgress[chapter]} /{getChapterLength(chapter)}
                      </div>
                    </div>{" "}
                    <Edit
                      className="z-10 hover:cursor-pointer"
                      size={64}
                      onClick={() => {
                        const input = prompt(
                          "set progress",
                          WOEProgress[chapter] + ""
                        );
                        if (input === null) return;
                        setWOEProgress(chapter, Number(input));
                      }}
                    />
                    <div className="z-10 flex justify-center w-full p-2">
                      {progressPercentage(chapter)}%
                    </div>
                  </div>
                </div>
              </>
            ))}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
  function progressPercentage(chapter: number) {
    return +(
      ((((WOEProgress[chapter] ?? 0.0000001) - 0.0000001) %
        getChapterLength(chapter)) *
        100) /
      getChapterLength(chapter)
    ).toFixed(2);
  }
  function getIterationNum(chapter: number) {
    return (
      Math.ceil(
        ((WOEProgress[chapter] ?? 0.0000001) - 0.0000001) /
          getChapterLength(chapter)
      ) + 1
    );
  }
}
