import getWordData from "@/utils/getWordData";

export async function GET(
  request: Request,
  {
    params: { surah, ayah, kalima },
  }: { params: { surah: number; ayah: number; kalima: number } }
) {
  return Response.json(await getWordData(surah, ayah, kalima));
}
