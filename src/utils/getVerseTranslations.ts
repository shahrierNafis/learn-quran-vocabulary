import getTranslationInfo from "./getTranslationInfo";

export default async function getVerseTranslations(
  translation_ids: string[],
  verse_key: `${string}:${string}`
): Promise<(T & Awaited<ReturnType<typeof getTranslationInfo>>[number])[]> {
  try {
    if (translation_ids.length == 0) return [];
    const { verse } = (await (
      await fetch(
        `https://api.quran.com/api/v4/verses/by_key/${verse_key}?translations=${translation_ids.join(",")}`
      )
    ).json()) ?? { translations: [] };
    const info = await getTranslationInfo();
    return (
      verse.translations.map((t: T) => {
        return {
          ...t,
          ...info.filter((i) => {
            return i.id == t.resource_id;
          })[0],
        };
      }) ?? []
    );
  } catch (error) {
    console.log(
      ` https://api.quran.com/api/v4/verses/by_key/${verse_key}?translations=${translation_ids.join(",")} \n ${error}`
    );
    if (confirm("Failed to fetch verse translations. Retry?")) {
      return getVerseTranslations(translation_ids, verse_key);
    }
    return [];
  }
}
type T = {
  id: number;
  resource_id: number;
  text: string;
};
