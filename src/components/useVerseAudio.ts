import { useAudioPlayerStore } from "@/stores/AudioPlayerStore";
import { usePreferenceStore } from "@/stores/preference-store";
import { WordCount } from "@/types/types";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

export default function useVerseAudio(verse_key?: string) {
  const [reciter_id] = usePreferenceStore(useShallow((s) => [s.reciter_id]));
  const [verseAudio, setVerseAudio] = useState<string>();
  const [openedVerse, setOpenedVerse] = useAudioPlayerStore(
    useShallow((s) => [s.openedVerse, s.setOpenedVerse])
  );

  useEffect(() => {
    usePreferenceStore.persist.rehydrate();
  }, []);
  useEffect(() => {
    if (!verse_key) return
    const [s, v] = verse_key?.split(":") || [];
    let url = `https://api.quran.com/api/v4/recitations/${reciter_id}/by_ayah/${verse_key}`;
    if (+v == 0) {
      //surah
      url = `https://api.quran.com/api/v4/chapter_recitations/${reciter_id}/${s}`;
      console.log(url);
      fetch(url)
        .then((res) => res.json())
        .then((r) => {
          setVerseAudio(r.audio_file.audio_url);
        });
      return;
    }
    fetch(url)
      .then((res) => res.json())
      .then((r) => {
        if ((r.audio_files[0].url as string).startsWith("//mirrors.")) {
          setVerseAudio(r.audio_files[0].url);
        } else
          setVerseAudio("https://audio.qurancdn.com/" + r.audio_files[0].url);
      });
    return () => { };
  }, [reciter_id, verse_key]);

  return {
    verseAudio,
    openedVerse,
    setOpenedVerse,
  };
}
