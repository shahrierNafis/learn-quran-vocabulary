import React, { useEffect } from "react";
import GotoDashboard from "./GotoDashboard";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { usePreferenceStore } from "@/stores/preference-store";
import { useShallow } from "zustand/react/shallow";
export default function McqNav({ leftToGo }: { leftToGo: number }) {
  const [
    setShowTransliteration,
    showTransliteration,
    setShowTranslation,
    showTranslation,
  ] = usePreferenceStore(
    useShallow((a) => [
      a.setShowTransliteration,
      a.showTransliteration,
      a.setShowTranslation,
      a.showTranslation,
    ])
  );

  useEffect(() => {
    usePreferenceStore.persist.rehydrate();
  }, []);

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
