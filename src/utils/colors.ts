import { COLOR, PartOfSpeech } from "@/types/types";

export const colors: { [key in COLOR]: PartOfSpeech[] } = {
  purple: ["ADJ"],
  navy: ["CIRC", "COM", "CONJ", "REM", "RSLT"],
  orange: ["COND", "INL", "LOC", "PREV", "T"],
  brown: ["DEM"],
  gray: [],
  rose: ["INTG"],
  sky: ["N", "SUBJ"],
  red: ["NEG", "PRO"],
  blue: ["PN"],
  rust: ["DET"],
  gold: ["PRP", "REL", "SUB"],
  seagreen: ["V"],
  green: ["VOC"],
  metal: ["OBJ"],
};
