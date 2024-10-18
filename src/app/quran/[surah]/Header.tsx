import React, { useEffect, useState } from "react";
import {
  Noto_Sans_Arabic,
  Noto_Kufi_Arabic,
  Noto_Naskh_Arabic,
  Amiri_Quran,
} from "next/font/google";
import { usePreferenceStore } from "@/stores/preference-store";
import { useShallow } from "zustand/react/shallow";
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
export default function Header({ surah }: { surah: number }) {
  const font = usePreferenceStore(useShallow((a) => a.font));
  const [title, setTitle] = useState("");
  useEffect(() => {
    fetch("https://api.quran.com/api/v4/chapters/" + surah)
      .then((r) => r.json())
      .then((r) =>
        setTitle(r.chapter.name_simple + ": " + r.chapter.translated_name.name)
      );

    return () => {};
  }, [surah]);

  return (
    <>
      {surah != 9 && (
        <div className="text-2xl md:text-4xl text-center">
          <div className={googleFonts[font].className}>
            <div className="m-8">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
          </div>
          <div>{title}</div>
        </div>
      )}
    </>
  );
}
