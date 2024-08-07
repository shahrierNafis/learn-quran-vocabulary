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
import SelectTranslation from "./SelectTranslation";
import SetIntervals from "./SetIntervals";
import UpdatePassword from "@/components/ChangePassword";

export default function Preference() {
  return (
    <>
      <Dialog>
        <DialogTrigger className="flex">
          <div className="flex flex-col p-2 border justify-center items-center flex-grow  basis-0 h-full cursor-pointer hover:bg-accent hover:text-accent-foreground">
            <Settings />
            Preference
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preference</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <SelectTranslation />
          <SetIntervals />
          <UpdatePassword />
        </DialogContent>
      </Dialog>
    </>
  );
}
