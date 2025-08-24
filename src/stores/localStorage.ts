import { create } from "zustand";
import { persist } from "zustand/middleware";
export const useLocalStorage = create<{
  difficulty: number;
  setDifficulty: (difficulty: number) => void;

  extraWordsPerWord: number;
  setExtraWordsPerWord: (extraWordsPerWord: number) => void;

  versesPerRound: number;
  setVersesPerRound: (versesPerRound: number) => void;
  mode: string;
  setMode: (mode: string) => void;
  skill: string;
  setSkill: (skill: string) => void;

  openedVerse: string | undefined;
  setOpenedVerse: (isOpen: string | undefined) => void;

  chapters: number[];
  setChapters: (chapters: number[]) => void;
  addChapter: (chapter: number) => void;
  removeChapter: (chapter: number) => void;
  VFSDialogOpen: boolean;
  setVFSDialogOpen: (open: boolean) => void;
}>()(
  persist(
    (set) => ({
      difficulty: 2,
      setDifficulty: (difficulty: number) => set({ difficulty }),

      extraWordsPerWord: 0,
      setExtraWordsPerWord: (extraWordsPerWord: number) =>
        set({ extraWordsPerWord }),

      versesPerRound: 10,
      setVersesPerRound: (versesPerRound: number) => set({ versesPerRound }),
      mode: "",
      setMode: (mode) => set({ mode }),
      skill: "",
      setSkill: (skill) => set({ skill }),

      openedVerse: undefined,
      setOpenedVerse: (openedVerse: string | undefined) => set({ openedVerse }),

      chapters: Array.from({ length: 114 }, (_, i) => i + 1), // initial state
      setChapters: (chapters: number[]) => set({ chapters }),
      addChapter: (chapter: number) => {
        set((state) => ({
          chapters: [...state.chapters, chapter],
        }));
      },
      removeChapter: (chapter: number) => {
        set((state) => ({
          chapters: state.chapters.filter((i) => i !== chapter),
        }));
      },

      VFSDialogOpen: false,
      setVFSDialogOpen: (VFSDialogOpen: boolean) => {
        set({ VFSDialogOpen });
      },
    }),
    {
      name: "useLocalStorage", // name of the item in the storage (must be unique)
      version: 2,
    }
  )
);
