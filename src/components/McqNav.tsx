import React from "react";
import GotoDashboard from "./GotoDashboard";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
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
      <Button
        variant={"outline"}
        onClick={() => setShowTransliteration(!showTransliteration)}
      >
        <Switch checked={showTransliteration} />
        Show Transliteration
      </Button>
      <Button
        variant={"outline"}
        onClick={() => setShowTranslation(!showTranslation)}
      >
        <Switch checked={showTranslation} />
        Show Translation
      </Button>
      <Button variant={"outline"} disabled>
        {leftToGo} more to go ⇒
      </Button>
    </div>
  );
}
