import React, { useEffect, useState } from "react";
import { usePreferenceStore } from "@/stores/preference-store";
import { useShallow } from "zustand/react/shallow";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Volume2, X } from "lucide-react";
import { Button } from "./ui/button";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useAudioPlayerStore } from "@/stores/AudioPlayerStore";

export default function VerseAudioBtn({ verse_key }: { verse_key: string }) {
  const [reciter_id] = usePreferenceStore(useShallow((s) => [s.reciter_id]));
  const [verseAudio, setVerseAudio] = useState<string>();
  const [openedVerse, setOpenedVerse] = useAudioPlayerStore(
    useShallow((s) => [s.openedVerse, s.setOpenedVerse])
  );

  useEffect(() => {
    usePreferenceStore.persist.rehydrate();
  }, []);
  useEffect(() => {
    fetch(
      `https://api.quran.com/api/v4/recitations/${reciter_id}/by_ayah/${verse_key}`
    )
      .then((res) => res.json())
      .then((r) => {
        console.log(r.audio_files[0].url);

        if ((r.audio_files[0].url as string).startsWith("//mirrors.")) {
          setVerseAudio(r.audio_files[0].url);
        } else
          setVerseAudio("https://audio.qurancdn.com/" + r.audio_files[0].url);
      });
    return () => {};
  }, [reciter_id, verse_key]);

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
