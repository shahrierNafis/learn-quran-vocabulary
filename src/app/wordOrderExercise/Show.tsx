import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useVerseAudio from "@/components/useVerseAudio";
import Verse from "@/components/Verse";
import { WORD } from "@/types/types";
import { Volume2 } from "lucide-react";
export default function Show({
  verse,
  verse_key,
  onClick,
}: {
  verse: WORD[];
  verse_key: string | null;
  onClick: () => void;
}) {
  const { setOpenedVerse } = useVerseAudio(verse_key!);
  return (
    <>
      <Dialog modal={false}>
        <DialogTrigger>
          <Button {...{ onClick }} variant={"outline"}>
            Show
          </Button>
        </DialogTrigger>
        <DialogContent>
          <div className="flex items-center justify-center">
            <Button
              onClick={() => {
                setOpenedVerse(verse_key!);
              }}
              className=""
              size={"icon"}
              variant={"ghost"}
              disabled={!verse_key}
            >
              <Volume2 />
            </Button>
            <Verse hideAudioPlayer {...{ verse }}></Verse>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
