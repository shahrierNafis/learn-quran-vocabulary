import React from "react";
import { Input } from "@/components/ui/input";
import { useShallow } from "zustand/react/shallow";
import { useVerse } from "./page";
import { Label } from "@/components/ui/label";
export default function ExtraWords() {
  const [setExtra, extra] = useVerse(
    useShallow((state) => [state.setExtra, state.extra])
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
            value={extra}
            onInput={(event) => setExtra(+event.currentTarget.value)}
          ></Input>
        </Label>
      </div>
    </>
  );
}
