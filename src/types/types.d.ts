export type Word = {
  text_imlaei: string;
  translation: { text: string };
  transliteration: { text: string };
  char_type_name: string;
  position: number;
  index: `${string}:${string}:${string}`;
};
