import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function ExtraVerse({
  setExtra,
}: {
  setExtra: (score: number) => void;
}) {
  return (
    <Select defaultValue={"3"} onValueChange={(i) => setExtra(+i)}>
      <SelectTrigger className="w-fit">
        <SelectValue placeholder="3 extra words per word" />
      </SelectTrigger>
      <SelectContent>
        {["0", "1", "2", "3"].map((i) => (
          <SelectItem key={i} value={i}>
            {i} extra Verse
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
