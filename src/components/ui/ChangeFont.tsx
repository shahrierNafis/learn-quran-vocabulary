import { usePreferenceStore } from "@/stores/preference-store";
import React, { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fontNames } from "@/utils/fontNames";
import {
  Noto_Sans_Arabic,
  Noto_Kufi_Arabic,
  Noto_Naskh_Arabic,
  Amiri_Quran,
} from "next/font/google";
import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "./button";
const sans = Noto_Sans_Arabic({
  weight: "400",
  subsets: ["arabic"],
});
const kufi = Noto_Kufi_Arabic({
  weight: "400",
  subsets: ["arabic"],
});
const naskh = Noto_Naskh_Arabic({
  weight: "400",
  subsets: ["arabic"],
});

const amiri_quran = Amiri_Quran({
  weight: "400",
  subsets: ["arabic"],
});
const googleFonts = {
  Noto_Sans_Arabic: sans,
  Noto_Kufi_Arabic: kufi,
  Noto_Naskh_Arabic: naskh,
  Amiri_Quran: amiri_quran,
};

export default function ChangeFont() {
  const [font, setFont] = usePreferenceStore(
    useShallow((a) => [a.font, a.setFont])
  );
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button>Change Font</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Font</DialogTitle>
            <DialogDescription>
              <div className="overflow-y-scroll max-h-[75vh]">
                {fontNames.map((f) => {
                  return (
                    <>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={f == font}
                          onClick={() => setFont(f)}
                        />{" "}
                        <div className="text-xl">{f}</div>
                      </div>
                      <div
                        className={
                          googleFonts[f].className +
                          " " +
                          "text-2xl md:text-4xl py-8 ml-4"
                        }
                      >
                        لَا إِلَٰهَ إِلَّا ٱللَّٰهُ مُحَمَّدٌ رَسُولُ ٱللَّٰهِ
                      </div>
                    </>
                  );
                })}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
