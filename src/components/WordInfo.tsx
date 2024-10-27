import React, { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WORD, WordData } from "@/types/types";
import SegmentInfo from "./SegmentInfo";
import { Volume2 } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

export default function WordInfo({
  children,
  disabled,
  wordSegments,
  word,
}: {
  children: ReactNode;
  disabled?: boolean;
  wordSegments: WordData;
  word?: WORD;
}) {
  if (disabled) {
    return <>{children}</>;
  }
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <div
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "text-[length:inherit]"
            )}
          >
            {children}
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Word Info</DialogTitle>
            <DialogDescription>
              <div className="overflow-y-auto  max-h-[85vh] ">
                <div className="flex justify-around items-center">
                  <div
                    dir="rtl"
                    className="text-3xl text-wrap m-4 justify-center items-center flex flex-col"
                  >
                    <div>{children}</div>{" "}
                    {word && (
                      <Button
                        className=""
                        onClick={() => {
                          new Audio(
                            "https://audio.qurancdn.com/" + word.audio_url
                          ).play();
                        }}
                        size={"icon"}
                        variant={"ghost"}
                      >
                        <Volume2 />
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center flex-col">
                    <div className="dark:text-green-100 text-green-950  text-sm">
                      {word?.transliteration.text}
                    </div>
                    <div className="dark:text-red-100 text-red-950 text-xs">
                      {word?.translation.text}
                    </div>
                  </div>
                </div>
                {wordSegments.map((segment, index) => (
                  <SegmentInfo
                    {...{ segment }}
                    key={segment.position + ":" + index}
                  />
                ))}{" "}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
