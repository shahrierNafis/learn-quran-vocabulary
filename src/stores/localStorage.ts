import { create } from "zustand";
import { persist } from "zustand/middleware";
export const useLocalStorage = create<{
    penalty: boolean,
    setPenalty: (penalty: boolean) => void,

    verse_key: string | null;
    setVerse_key: (verse: string | null) => void;
    extra: number;
    setExtra: (extra: number) => void;

    verseLengths: number[];
    setVerseLengths: (verseLengths: number[]) => void;
    addVerseLength: (verseLength: number) => void;
    removeVerseLength: (verseLength: number) => void;
    VLDialogOpen: boolean;
    setVLDialogOpen: (open: boolean) => void;

    versesPerRound: number
    setVersesPerRound: (versesPerRound: number) => void;
    mode: string;
    setMode: (mode: string) => void;
    skill: string;
    setSkill: (skill: string) => void;

    openedVerse: string | undefined;
    setOpenedVerse: (isOpen: string | undefined) => void;

}>()(
    persist(
        (set, get) => ({
            penalty: true,
            setPenalty: (penalty: boolean) => { set({ penalty }) },

            verse_key: "", // initial state
            setVerse_key: (verse_key: string | null) => set({ verse_key }),
            extra: 0,
            setExtra: (extra: number) => set({ extra }),

            verseLengths: [4], // initial state
            setVerseLengths: (verseLengths: number[]) => set({ verseLengths }),
            addVerseLength: (verseLength: number) => {
                set((state) => ({
                    verseLengths: [...state.verseLengths, verseLength],
                }));
            },
            removeVerseLength: (verseLength: number) => {
                set((state) => ({
                    verseLengths: state.verseLengths.filter((i) => i !== verseLength),
                }));
            },
            VLDialogOpen: false,
            setVLDialogOpen: (VLDialogOpen: boolean) => {
                set({ VLDialogOpen });
            },

            versesPerRound: 10,
            setVersesPerRound: (versesPerRound: number) => set({ versesPerRound }),
            mode: "",
            setMode: (mode) => set({ mode }),
            skill: "",
            setSkill: (skill) => set({ skill }),

            openedVerse: undefined,
            setOpenedVerse: (openedVerse: string | undefined) => set({ openedVerse }),
        }),
        {
            name: "useLocalStorage", // name of the item in the storage (must be unique)
        }
    )
);