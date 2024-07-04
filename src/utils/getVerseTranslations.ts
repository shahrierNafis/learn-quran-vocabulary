import getTranslationInfo from "./getTranslationInfo";

export default async function getVerseTranslations(
  translation_ids: string[],
  verse_key: `${string}:${string}`
): Promise<(T & Awaited<ReturnType<typeof getTranslationInfo>>[number])[]> {
  try {
    const { verse } = await (
      await fetch(
        `https://api.quran.com/api/v4/verses/by_key/${verse_key}?translations=${translation_ids.join(",")}`
      )
    ).json();
    const info = await getTranslationInfo();
    return verse.translations.map((t: T) => {
      return {
        ...t,
        ...info.filter((i) => {
          return i.id == t.resource_id;
        })[0],
      };
    });
  } catch (error) {
    console.log(
      ` https://api.quran.com/api/v4/verses/by_key/${verse_key}?translations=${translation_ids.join(",")} \n ${error}`
    );
    return getVerseTranslations(translation_ids, verse_key);
  }
}
type T = {
  id: number;
  resource_id: number;
  text: string;
};
