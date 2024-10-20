import React from "react";
import { Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SelectTranslation from "./dashboard/SelectTranslation";
import SetIntervals from "./dashboard/SetIntervals";
import UpdatePassword from "@/components/ChangePassword";
import ChangeColours from "@/components/ui/ChangeColours";
import ChangeFont from "@/components/ui/ChangeFont";
import { createClient } from "@/utils/supabase/clients";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePreferenceStore } from "@/stores/preference-store";
import { useShallow } from "zustand/react/shallow";
import { Switch } from "@/components/ui/switch";
import { ModeToggle } from "@/components/ui/ModeToggle";
export default function Preference() {
  const supabase = createClient();
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

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (user) setIsLoggedIn(true);
    });

    return () => {};
  }, [supabase.auth]);

  return (
    <>
      <Dialog>
        <DialogTrigger className="flex">
          <Button asChild variant={"outline"}>
            <div>
              <Settings />
              Preference
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preference</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>{" "}
          <div className="overflow-y-auto flex flex-col max-h-[85vh] justify-start gap-2">
            <SelectTranslation />
            <ChangeColours />
            <ChangeFont />
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
            <ModeToggle />

            {isLoggedIn && <SetIntervals />}
            <UpdatePassword />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
