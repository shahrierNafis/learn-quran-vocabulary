import React, { useEffect, useState } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { MultiSelect } from "@/components/MultiSelect";
export default function SelectTranslation() {
  const [translation_id, setTranslation_id] = useLocalStorage<string[]>(
    "translation_ids",
    ["20"]
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
      <MultiSelect
        options={
          translations?.map((t) => {
            return { label: t.name, value: t.id + "" };
          }) ?? []
        }
        onValueChange={setTranslation_id}
        defaultValue={translation_id}
        placeholder="Select translations"
        variant="default"
      />
    </>
  );
}
