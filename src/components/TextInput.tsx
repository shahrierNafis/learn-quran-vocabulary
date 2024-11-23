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
  const [showTranslation, showTransliteration, showTranslationOnHiddenWords] =
    usePreferenceStore(
      useShallow((a) => [
        a.showTranslation,
        a.showTransliteration,
        a.showTranslationOnHiddenWords,
      ])
    );
  useEffect(() => {
    usePreferenceStore.persist.rehydrate();
  }, []);
  const [,] = useState();
  if (
    word.text_imlaei.normalize("NFD").replace(/[\u064B-\u065F]/g, "") ===
    text.trim()
  ) {
    isValid();
  }
  return (
    <>
      <div className="flex flex-col justify-center items-center w-fit">
        <input
          type="text"
          value={text.normalize("NFD").replace(/[\u064B-\u065F]/g, "")}
          size={5}
          onChange={(e) => setText(e.target.value)}
          placeholder="_?_?_?_"
          className={cn(
            "placeholder:text-center text-red-500",
            `${
              word.text_imlaei
                .normalize("NFD")
                .replace(/[\u064B-\u065F]/g, "")
                .startsWith(
                  text
                    .trim()
                    .normalize("NFD")
                    .replace(/[\u064B-\u065F]/g, "")
                ) && "text-green-500 border "
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
