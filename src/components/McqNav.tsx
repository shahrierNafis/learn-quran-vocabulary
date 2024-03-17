import React from "react";
import GotoDashboard from "./GotoDashboard";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Switch } from "./ui/switch";
export default function McqNav({ leftToGo }: { leftToGo: number }) {
  const [showTranslation, setShowTranslation] = useLocalStorage<boolean>(
    "showTranslation",
    true
  );
  const [showTransliteration, setShowTransliteration] =
    useLocalStorage<boolean>("showTransliteration", true);
  return (
    <div className="flex flex-wrap items-center">
      <GotoDashboard />
      <div className="flex shrink-0 items-center border p-2 gap-2">
        <Switch
          checked={showTransliteration}
          onCheckedChange={setShowTransliteration}
        />
        Show Transliteration
      </div>
      <div className="flex items-center border p-2  gap-2">
        <Switch
          checked={showTranslation}
          onCheckedChange={setShowTranslation}
        />
        Show Translation
      </div>{" "}
      <div className=" cursor-not-allowed  p-2 border">
        {leftToGo} more to go ⇒
      </div>
    </div>
  );
}
