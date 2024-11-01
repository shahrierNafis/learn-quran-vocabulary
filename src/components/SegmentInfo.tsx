import React from "react";
import { WordSegment } from "@/types/types";
import { usePreferenceStore } from "@/stores/preference-store";
import { useShallow } from "zustand/react/shallow";
import { useTheme } from "next-themes";
import { buckwalter_to_arabic } from "@/utils/arabic-buckwalter-transliteration";
import useFont from "@/utils/useFont";
import { cn } from "@/lib/utils";
import relations from "@/utils/relations";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
export default function SegmentInfo({ segment }: { segment: WordSegment }) {
  const [colours] = usePreferenceStore(useShallow((a) => [a.colours]));
  const { theme } = useTheme();
  const [font] = useFont();

  return (
    <>
      <div>
        <div className="text-xl shadow">
          <div
            dir="rtl"
            className={cn("text-2xl", font?.className)}
            style={{
              color: (colours[segment.partOfSpeech] ?? colours.others)[
                theme == "dark" ? 1 : 0
              ],
            }}
          >
            {segment.arabic}
          </div>
          {(Object.keys(segment) as Array<keyof typeof segment>).map(
            (property) => {
              if (property == "root") {
                return (
                  <div key={property} className="">
                    {segment.root && (
                      <>
                        <div className="grid grid-cols-2 items-center   align-middle">
                          <div> root:</div>
                          <Link
                            className="border rounded px-2 max-w-fit focus:ring hover:ring"
                            target="_blank"
                            href={"/root/" + segment.root}
                          >
                            <div className={cn(font?.className, "")}>
                              {buckwalter_to_arabic(segment.root)
                                .split("")
                                .join(",")}
                            </div>
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                );
              }
              if (property == "number") {
                return (
                  <div key={property} className="">
                    {segment.number && (
                      <>
                        <div className="grid grid-cols-2 items-center   align-middle">
                          <div> number:</div>
                          <div className={cn("inline")}>
                            {segment.number == "D"
                              ? "Dual"
                              : segment.number == "P"
                                ? "Plural"
                                : "Singular"}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              }
              if (
                property == "arabic" ||
                property == "arPartOfSpeech" ||
                property == "position" ||
                property == "lemma"
              ) {
                return <></>;
              }
              if (property == "mood") {
                return (
                  <div key={property} className="">
                    {segment.mood && (
                      <>
                        <div className="grid grid-cols-2 items-center   align-middle">
                          <div> mood:</div>
                          <div className={cn("inline")}>
                            {segment.mood == "IND"
                              ? "Indicative"
                              : segment.mood == "JUS"
                                ? "Jussive"
                                : "Subjunctive"}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              }

              return (
                <>
                  <div key={property} className="">
                    {segment[property] && (
                      <>
                        <div className="grid grid-cols-2 items-center   align-middle">
                          <div> {property}:</div>
                          <div className={cn("inline")}>
                            {names[segment[property]] ?? segment[property]}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              );
            }
          )}
        </div>
      </div>
    </>
  );
}
const names: { [key: string]: string } = {
  ...relations,
  M: "Male",
  F: "Female",
  PERF: "Perfect",
  IMPF: "Imperfect",
  "ACT PCPL": "Active participle",
  "PASS PCPL": "Passive participle",
  VN: "Verbal noun",
  DEF: "Definite",
  INDEF: "Indefinite",
  NOM: "Nominative",
  ACC: "Accusative",
  GEN: "Genitive",
};
