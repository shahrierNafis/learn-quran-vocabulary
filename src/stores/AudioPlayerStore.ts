import { create } from "zustand";
export const useAudioPlayerStore = create<{
  openedVerse: string | undefined;
  setOpenedVerse: (isOpen: string | undefined) => void;
}>((set) => {
  return {
    openedVerse: undefined,
    setOpenedVerse: (openedVerse: string | undefined) => set({ openedVerse }),
  };
});
