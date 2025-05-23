// import { createSeedClient } from "@snaplet/seed";
import herf from "./.seed-data/harfList.json";
import ism_n_fill from "./.seed-data/ism&fi'lList.json";
import suffix from "./.seed-data/suffixList.json";
import prefix from "./.seed-data/prefixList.json";

// const seed = await createSeedClient({
//   dryRun: process.env.DRY !== "0",
// });
// if (process.env.RESET) await seed.$resetDatabase();

const collectionsD = [
  {
    id: 1,
    name: "ism & fi'l",
    is_default: true,
    description: `Ism (اسم) translates to "name" and encompasses nouns, adjectives, pronouns, and proper names. Ism words have grammatical features like gender (masculine or feminine) and number (singular, dual, or plural). Fiʻl means "verb" and refers to words expressing actions or states of being. Arabic verbs can conjugate based on tense, person, and number.`,
  },
  {
    id: 2,
    name: "herf",
    is_default: true,
    description: `Harf (حرف) translates to "letter" but refers to particles. These are function words that connect other words in a verse and indicate grammatical relationships. Prepositions and conjunctions fall under this category.`,
  },
  {
    id: 3,
    name: "prefix",
    is_default: true,
    description: `Arabic utilizes prefixes to add meaning and function to words. prefixes are less numerous and often serve specific grammatical purposes.  One prominent example is the definite article "al-" (الـ), which transforms indefinite nouns and adjectives into definite ones. For instance, "kitab" (كتاب) means "book," but "al-kitab" (الكتاب) translates to "the book."`,
  },
  {
    id: 4,
    name: "suffix",
    is_default: true,
    description:
      "Arabic is a language with complex morphology. This means that a single Arabic word can convey a complete verse in English. For instance, the word 'fajaʿalnāhum' (فَجَعَلْنَٰهُمُ), found in verse (23:41), translates to the English verse 'and We made them'. In Arabic, suffixes could be attached to words to indicate the subjects and objects.",
  },
];
const wordGroupsD = [
  ...ism_n_fill.map((wordGroup) => {
    return {
      words: wordGroup.positions,
      collectionId: 1,
      name: wordGroup.name,
      description: wordGroup.description,
    };
  }),
  ...herf.map((wordGroup) => {
    return {
      words: wordGroup.positions,
      collectionId: 2,
      name: wordGroup.name,
      description: wordGroup.description,
    };
  }),
  ...prefix.map((wordGroup) => {
    return {
      words: wordGroup.positions,
      collectionId: 3,
      name: wordGroup.name,
      description: wordGroup.description,
    };
  }),
  ...suffix.map((wordGroup) => {
    return {
      words: wordGroup.positions,
      collectionId: 4,
      name: wordGroup.name,
      description: wordGroup.description,
    };
  }),
];
// await seed.collections(collections);
// await seed.wordGroups(wordGroups);
// Run it with: DRY=0 npx tsx seed.mts

import { drizzle } from "drizzle-orm/postgres-js";
import { collections, wordGroups } from "./drizzle/schema.ts";
async function main() {
  const db = drizzle(process.env.DATABASE_URL!);

  // ... you will write your Prisma Client queries here
  try {
    await db.insert(collections).values(collectionsD);
    await db.insert(wordGroups).values(wordGroupsD);
  } catch (error) {
    console.log(error);
  }
}

console.log("Seeding data...");
await main().catch(async (e) => {
  console.error(e);
  process.exit(1);
});
