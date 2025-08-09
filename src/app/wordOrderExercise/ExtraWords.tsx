import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useShallow } from "zustand/react/shallow";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/stores/localStorage";
export default function ExtraWords() {
  const [setExtraWordsPerWord, extraWordsPerWord] = useLocalStorage(
    useShallow((state) => [state.setExtraWordsPerWord, state.extraWordsPerWord])
  );

  return (
    <>
      <div className="flex ">
        <Label className="flex flex-col w-full">
          Extra words per word
          <Input
            type="number"
            size={3}
            placeholder="extra words per word"
            value={extraWordsPerWord}
            onInput={(event) =>
              setExtraWordsPerWord(+event.currentTarget.value)
            }
          ></Input>
        </Label>
      </div>
    </>
  );
}
