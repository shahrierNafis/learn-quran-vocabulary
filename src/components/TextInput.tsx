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

  useEffect(() => {
    console.log(simplifyArabic(word.text_imlaei));
  }, [word]);

  const [,] = useState();
  if (simplifyArabic(word.text_imlaei) === text) {
    isValid();
  }
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
              simplifyArabic(word.text_imlaei).startsWith(text) &&
              "text-green-500 border "
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
function simplifyArabic(text: string) {
  // Arabic diacritics and special marks to remove
  const arabicLetterPattern = /[\u0621-\u064A]/g;

  // Find all Arabic letters and join them
  const matches = text.normalize("NFD").match(arabicLetterPattern);
  return (matches ? matches.join("") : "").replace(" ", "").trim();

  // Remove all diacritics
}
