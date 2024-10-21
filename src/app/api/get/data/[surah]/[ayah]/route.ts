import getVerseData from "@/utils/getVerseData";

export async function GET(
  request: Request,
  { params: { surah, ayah } }: { params: { surah: number; ayah: number } }
) {
  return Response.json(await getVerseData(surah, ayah));
}
