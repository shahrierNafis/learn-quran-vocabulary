import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CollectionProgress({
  progressArr,
  wordGroups,
}: {
  progressArr:
    | {
        progress: number;
        word_groups: {
          collection_id: number;
          id: number;
        } | null;
      }[]
    | null;
  wordGroups: {
    id: number;
    words: string[];
  }[];
}) {
  return (
    <>
      <Dialog>
        <DialogTrigger className="grow w-full">
          <Component {...{ progressArr, wordGroups }} />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Progress</DialogTitle>
            <DialogDescription>
              <div className="md:w-[75%] mx-auto">
                <Component {...{ progressArr, wordGroups }} />

                <div
                  style={{ gridTemplateColumns: "auto 1fr" }}
                  className="grow grid-cols-2 w-full text-nowrap text-xs text-gray-500 grid"
                >
                  {progressArr &&
                    Object.entries(flattenedProgressObj(progressArr)).map(
                      ([progress, word_groups]) => (
                        <>
                          {" "}
                          <div className="text-nowrap text-end">
                            {progress}% mastered:
                          </div>
                          <div className="text-end">
                            {word_groups.length}/{wordGroups.length}{" "}
                            {roundNumber(
                              (word_groups.length / wordGroups.length) * 100
                            )}
                            %
                          </div>
                        </>
                      )
                    )}{" "}
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
function roundNumber(num: number) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}
function flattenedProgressObj(
  progressArr: {
    progress: number;
    word_groups: {
      collection_id: number;
      id: number;
    } | null;
  }[]
) {
  const obj: {
    [key: number]: {
      collection_id: number;
      id: number;
    }[];
  } = {};
  progressArr.forEach((p) => {
    obj[p.progress] = obj[p.progress] ?? [];
    p.word_groups && obj[p.progress].push(p.word_groups);
  });
  return obj;
}

function Component({
  progressArr,
  wordGroups,
}: {
  progressArr:
    | {
        progress: number;
        word_groups: {
          collection_id: number;
          id: number;
        } | null;
      }[]
    | null;
  wordGroups: {
    id: number;
    words: string[];
  }[];
}) {
  return (
    <>
      <div
        style={{ gridTemplateColumns: "auto 1fr" }}
        className="grow grid-cols-2 w-full text-nowrap text-xs text-gray-500 grid"
      >
        <div className="text-end">Introduced:</div>
        {progressArr ? (
          <div className="text-end">
            {progressArr.length}/{wordGroups.length}{" "}
            {roundNumber((progressArr.length / wordGroups.length) * 100)}%
          </div>
        ) : (
          "loading"
        )}
        <div className="text-nowrap text-end">Mastered: </div>
        {progressArr ? (
          <div className="text-end">
            {roundNumber(
              (progressArr
                .map((pA) => pA.progress)
                .reduce((prev, curr) => prev + curr, 0) /
                (wordGroups.length * 100)) *
                100
            )}
            %
          </div>
        ) : (
          "loading"
        )}
        <div className="text-nowrap text-end">Word coverage: </div>
        {progressArr ? (
          <div className="text-end">
            {roundNumber(
              (progressArr
                .map((pA) =>
                  pA.word_groups
                    ? pA.progress *
                      wordGroups.filter(
                        (wg) => pA.word_groups && wg.id == pA.word_groups.id
                      )[0]?.words.length
                    : 0
                )
                .reduce((prev, curr) => prev + curr, 0) /
                wordGroups
                  .map((pA) => pA.words.length * 100)
                  .reduce((prev, curr) => prev + curr, 0)) *
                100
            )}
            %
          </div>
        ) : (
          "loading"
        )}
      </div>
    </>
  );
}
