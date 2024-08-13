import { Word } from "@/types/types";
import React from "react";

function WordImage({ word }: { word: Word }) {
  return (
    <div>
      {word.wordImage ? (
        <img
          className="md:h-[4rem] h-[3rem] m-auto"
          alt={word.text_imlaei}
          src={URL.createObjectURL(word.wordImage)}
        ></img>
      ) : (
        word.text_imlaei
      )}
    </div>
  );
}

export default WordImage;
