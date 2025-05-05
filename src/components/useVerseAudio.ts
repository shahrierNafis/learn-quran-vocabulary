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
    if (verse_key) {
      setOpenedVerse(verse_key);
    }
    return () => {};
  }, [setOpenedVerse, verse_key]);
  useEffect(() => {
    setVerseAudio(
      `https://cdn.islamic.network/quran/audio/${bitrate[reciter_id][0]}/${reciter_id}/${getVerseNOWithKey(openedVerse ?? "")}.mp3`
    );
    return () => {};
  }, [openedVerse, reciter_id, verse_key]);
  return {
    verseAudio,
    openedVerse,
    setOpenedVerse,
  };
}
const bitrate: { [key: string]: (32 | 40 | 48 | 64 | 128 | 192 | 320)[] } = {
  "ar.abdullahbasfar": [192, 64, 32],
  "ar.abdullahbasfar-2": [192, 64, 32],
  "ar.hudhaify": [128, 64, 32],
  "ar.hudhaify-2": [128, 64, 32],
  "ar.ibrahimakhbar": [32],
  "fa.hedayatfarfooladvand": [40],
  "ar.parhizgar": [48],
  "ar.abdulbasitmurattal": [192, 64],
  "ar.abdulbasitmurattal-2": [192, 64],
  "ar.abdulsamad": [64],
  "ar.abdurrahmaansudais": [192, 64],
  "ar.abdurrahmaansudais-2": [192, 64],
  "ar.ahmedajamy": [128, 64],
  "ar.alafasy": [128, 64],
  "ar.alafasy-2": [128, 64],
  "ar.aymanswoaid": [64],
  "ar.aymanswoaid-2": [64],
  "ar.hanirifai": [192, 64],
  "ar.hanirifai-2": [192, 64],
  "ar.husary": [128, 64],
  "ar.husary-2": [128, 64],
  "ar.husarymujawwad": [128, 64],
  "ar.husarymujawwad-2": [128, 64],
  "ar.mahermuaiqly": [128, 64],
  "ar.mahermuaiqly-2": [128, 64],
  "ar.minshawimujawwad": [64],
  "ar.minshawimujawwad-2": [64],
  "ar.saoodshuraym": [64],
  "ar.saoodshuraym-2": [64],
  "ar.shaatree": [128, 64],
  "ar.shaatree-2": [128, 64],
  "ur.khan": [64],
  "ar.minshawi": [128],
  "ar.minshawi-2": [128],
  "ar.muhammadayyoub": [128],
  "ar.muhammadayyoub-2": [128],
  "ar.muhammadjibreel": [128],
  "ar.muhammadjibreel-2": [128],
  "fr.leclerc": [128],
  "ru.kuliev-audio": [128],
  "zh.chinese": [128],
  "en.walk": [192],
  "ru.kuliev-audio-2": [320],
};
const getVerseNOWithKey = (verse_key: string) => {
  const [sura, ayah] = verse_key.split(":");
  let VerseNO = 0;
  const wordCount: WordCount = require("./../wordCount.json");
  for (let i = 1; i < +sura; i++) {
    VerseNO += Object.entries(wordCount[i]).length;
  }
  return VerseNO + +ayah;
};
