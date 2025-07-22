"use client";
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
import { useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useOnlineStorage } from "@/stores/onlineStorage";
import { useShallow } from "zustand/react/shallow";
import { Switch } from "@/components/ui/switch";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { SetReviewOrder } from "@/components/SetReviewOrder";
import ChangeReciter from "@/components/ChangeReciter";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
export default function Preference() {
  const [
    setShowTransliteration,
    showTransliteration,
    setShowTranslation,
    showTranslation,
    setShowTranslationOnHiddenWords,
    showTranslationOnHiddenWords,
  ] = useOnlineStorage(
    useShallow((a) => [
      a.setShowTransliteration,
      a.showTransliteration,
      a.setShowTranslation,
      a.showTranslation,
      a.setShowTranslationOnHiddenWords,
      a.showTranslationOnHiddenWords,
    ])
  );

  useEffect(() => {
    useOnlineStorage.persist.rehydrate();
  }, []);
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings /> Preference{" "}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preference</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>{" "}
          <div className="overflow-y-auto flex flex-col max-h-[85vh] justify-start gap-2 p-2">
            <SelectTranslation />
            <ChangeColours />
            <ChangeFont />
            <ChangeReciter />
            <div
              style={{ gridTemplateColumns: "auto 1fr" }}
              className="grid align-middle rounded-md text-sm font-medium ring-offset-background transition-colors"
            >
              <div
                className={
                  "flex h-10 px-4 py-2 rounded-md  justify-center items-center border"
                }
              >
                Show Transliteration on words{" "}
              </div>{" "}
              <Button
                className="h-full"
                onClick={() => setShowTransliteration(!showTransliteration)}
                variant={"outline"}
              >
                <Switch checked={showTransliteration} />
              </Button>
              <div
                className={
                  "flex h-10 px-4 py-2 rounded-md  justify-center items-center border"
                }
              >
                Show Translation on words{" "}
              </div>{" "}
              <Button
                className="h-full"
                onClick={() => setShowTranslation(!showTranslation)}
                variant={"outline"}
              >
                <Switch checked={showTranslation} />
              </Button>
              <div
                className={
                  "flex h-10 px-4 py-2 rounded-md  justify-center items-center border"
                }
              >
                Show Translation on hidden words
              </div>{" "}
              <Button
                className="h-full"
                onClick={() =>
                  setShowTranslationOnHiddenWords(!showTranslationOnHiddenWords)
                }
                variant={"outline"}
              >
                <Switch
                  disabled={!showTranslation}
                  checked={showTranslation && showTranslationOnHiddenWords}
                />
              </Button>
            </div>
            <ModeToggle />
            <SetReviewOrder />
            <SetIntervals />
            <UpdatePassword />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
