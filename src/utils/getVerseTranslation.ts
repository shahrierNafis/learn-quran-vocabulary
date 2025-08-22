export default async function getVerseTranslation(
  translation_id: number,
  verse_key: `${string}:${string}`
): Promise<string | null> {
  try {
    const res = await (
      await fetch(
        `https://api.quran.com/api/v4/quran/translations/${translation_id}?verse_key=${verse_key}`
      )
    ).json();
    return res.translations[0].text;
  } catch (error) {
    console.log(
      `Error while fetching the data: https://api.quran.com/api/v4/quran/translations/${translation_id}?verse_key=${verse_key} \n ${error}`
    );
    if (confirm("Failed to fetch translation. Retry?"))
      return getVerseTranslation(translation_id, verse_key);
    return null;
  }
}
