import { createClient } from "./supabase/clients";
export default async function getWordImage(
  index: `${string}:${string}:${string}`
) {
  const supabase = createClient();
  const { data: wordImage, error } = await supabase.storage
    .from("bucket1")
    .download("wordImage/" + index + ".png");
  if (error) {
    throw new Error(error.message);
  }
  return wordImage;
}
