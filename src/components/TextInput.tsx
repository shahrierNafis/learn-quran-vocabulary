import { usePreferenceStore } from "@/stores/preference-store";
import { useShallow } from "zustand/react/shallow";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { WORD } from "@/types/types";

export default function TextInput({
  text,
  setText,
  word,
  isValid,
}: {
  text: string;
  setText: (text: string) => void;
  word: WORD;
  isValid: () => void;
}) {
  const [showTranslation, showTransliteration] = usePreferenceStore(
    useShallow((a) => [a.showTranslation, a.showTransliteration])
  );
  useEffect(() => {
    usePreferenceStore.persist.rehydrate();
  }, []);

  const [,] = useState();
  if (
    simplifyArabic(word.wordSegments.map((w) => w.arabic).join("")) === text
  ) {
    isValid();
  }
  console.log(simplifyArabic(word.wordSegments.map((w) => w.arabic).join("")));

  return (
    <>
      <div className="flex flex-col justify-center items-center w-fit">
        <input
          type="text"
          value={text}
          size={5}
          onChange={(e) => setText(simplifyArabic(e.target.value))}
          placeholder="_?_?_?_"
          className={cn(
            "placeholder:text-center text-red-500",
            `${
              simplifyArabic(
                word.wordSegments.map((w) => w.arabic).join("")
              ).startsWith(text) && "text-green-500 border "
            }`
          )}
        />
        {showTransliteration && (
          <div className="dark:text-green-100 text-green-950  text-sm">
            _ _ _ _
          </div>
        )}
        {showTranslation && (
          <div className="dark:text-red-100 text-red-950 text-xs justify-self-end">
            <>_ _ _ _</>
          </div>
        )}{" "}
      </div>
    </>
  );
}
/**
 * Removes Arabic diacritical marks (harakat/tashkeel) and dialectical marks from text
 * @param {string} text - The Arabic text to clean
 * @returns {string} The cleaned text with diacritical marks removed
 */
export function simplifyArabic(text: string): string {
  // Replace variations of letters
  let normalizedText = text
    .replace(/أ|إ|ٱ|ا۟|آ/g, "ا") // Normalize Alef
    .replace(/ؤ/g, "و") // Normalize Waw with Hamza
    .replace(/ئ/g, "ى"); // Normalize Ya with Hamza
  // .replace(/ة/g, "ه"); // Normalize Ta Marbuta to Ha

  // Remove diacritics (including dagger alef and superscript alef)
  normalizedText = normalizedText.replace(
    /[\u064B-\u065F\u0670\u06DF\u06E5\u06E2\u06ED\u06E6 ]/g,
    ""
  );

  // Remove Tatweel (Kashida)
  normalizedText = normalizedText.replace(/ـ+/g, "");

  return normalizedText.replaceAll(" ", "");
}
