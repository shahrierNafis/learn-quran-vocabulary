import React, { useEffect, useState } from "react";
import useFont from "@/utils/useFont";
export default function Header({ surah }: { surah: number }) {
  const [font] = useFont();
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
          <div className={font?.className}>
            <div className="m-8">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
          </div>
          <div>{title}</div>
        </div>
      )}
    </>
  );
}
