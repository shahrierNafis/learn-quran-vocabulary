export default async function getVerseTranslation(
  translation_id: number,
  verse_key: `${string}:${string}`
) {
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
    return getVerseTranslation(translation_id, verse_key);
  }
}
