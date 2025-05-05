import React, { useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Volume2, X } from "lucide-react";
import { Button } from "./ui/button";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import useVerseAudio from "./useVerseAudio";

export default function VerseAudioBtn({ verse_key }: { verse_key: string }) {
  const { verseAudio, openedVerse, setOpenedVerse } = useVerseAudio(verse_key);
  return (
    <>
      <Drawer open={openedVerse == verse_key} modal={false}>
        <DrawerTrigger>
          <div className="flex">
            <Button
              onClick={() => setOpenedVerse(verse_key)}
              className=""
              size={"icon"}
              variant={"ghost"}
            >
              <Volume2 />
            </Button>
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <AudioPlayer
            autoPlay
            loop
            src={verseAudio}
            showJumpControls={false}
            // other props here
            customControlsSection={[
              RHAP_UI.ADDITIONAL_CONTROLS,

              RHAP_UI.MAIN_CONTROLS,
              <Button
                key={verse_key}
                className="w-fit m-auto rounded-full aspect-square"
                variant={"outline"}
                size={"icon"}
                onClick={() => setOpenedVerse(undefined)}
              >
                <X />
              </Button>,
              RHAP_UI.VOLUME_CONTROLS,
            ]}
          />
        </DrawerContent>
      </Drawer>
    </>
  );
}
