import React, { useEffect, useState } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function SelectTranslation() {
  const [translation_id, setTranslation_id] = useLocalStorage<number>(
    "translation_id",
    20
  );
  const [translations, setTranslations] = useState<
    {
      id: number;
      name: string;
    }[]
  >();
  useEffect(() => {
    fetch("https://api.quran.com/api/v4/resources/translations")
      .then((res) => {
        return res.json();
      })
      .then(({ translations }) => setTranslations(translations));

    return () => {};
  }, []);

  return (
    <>
      <div className="flex items-center">
        <div> Translation:</div>
        <Select defaultValue={`${translation_id}`}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a translation" />
          </SelectTrigger>
          <SelectContent>
            {translations &&
              translations.map((translation) => {
                return (
                  <SelectItem
                    key={translation.id}
                    value={`${translation.id}`}
                    onClick={() => setTranslation_id(translation_id)}
                  >
                    {translation.name}
                  </SelectItem>
                );
              })}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
