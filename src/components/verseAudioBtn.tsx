import React, { useEffect, useState } from "react";
import { usePreferenceStore } from "@/stores/preference-store";
import { useShallow } from "zustand/react/shallow";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Volume2 } from "lucide-react";
import { Button } from "./ui/button";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

export default function VerseAudioBtn({ verse_key }: { verse_key: string }) {
  const [reciter_id] = usePreferenceStore(useShallow((s) => [s.reciter_id]));
  const [verseAudio, setVerseAudio] = useState<string>();
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
      <div dir="rtl">
        <Popover>
          <PopoverTrigger>
            <div className="flex">
              <Button className="" size={"icon"} variant={"ghost"}>
                <Volume2 />
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[45vw] ">
            <AudioPlayer
              autoPlay
              loop
              src={verseAudio}
              // other props here
            />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
