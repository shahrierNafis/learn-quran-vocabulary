// import { createSeedClient } from "@snaplet/seed";
import herf from "./.seed-data/harfList.json";
import ism from "./.seed-data/ismList.json";
import fill from "./.seed-data/fi'lList.json";
import suffix from "./.seed-data/suffixList.json";
import prefix from "./.seed-data/prefixList.json";

// const seed = await createSeedClient({
//   dryRun: process.env.DRY !== "0",
// });
// if (process.env.RESET) await seed.$resetDatabase();

const collections = [
  {
    id: 1,
    name: "ism",
    is_default: true,
    description: `Ism (اسم) translates to "name" and encompasses nouns, adjectives, pronouns, and proper names. Ism words have grammatical features like gender (masculine or feminine) and number (singular, dual, or plural).`,
  },
  {
    id: 2,
    name: "Fiʻl",
    is_default: true,
    description: `Fiʻl means "verb" and refers to words expressing actions or states of being. Arabic verbs can conjugate based on tense, person, and number.`,
  },
  {
    id: 3,
    name: "herf",
    is_default: true,
    description: `Harf (حرف) translates to "letter" but refers to particles. These are function words that connect other words in a sentence and indicate grammatical relationships. Prepositions and conjunctions fall under this category.`,
  },
  {
    id: 4,
    name: "prefix",
    is_default: true,
    description: `Arabic utilizes prefixes to add meaning and function to words. prefixes are less numerous and often serve specific grammatical purposes.  One prominent example is the definite article "al-" (الـ), which transforms indefinite nouns and adjectives into definite ones. For instance, "kitab" (كتاب) means "book," but "al-kitab" (الكتاب) translates to "the book."`,
  },
  {
    id: 5,
    name: "suffix",
    is_default: true,
    description:
      "Arabic is a language with complex morphology. This means that a single Arabic word can convey a complete sentence in English. For instance, the word 'fajaʿalnāhum' (فَجَعَلْنَٰهُمُ), found in verse (23:41), translates to the English sentence 'and We made them'. In Arabic, suffixes could be attached to words to indicate the subjects and objects.",
  },
];
const wordGroups = [
  ...ism.map((wordGroup) => {
    return {
      words: wordGroup.positions,
      collection_id: 1,
      name: wordGroup.name,
      description: wordGroup.description,
      options: wordGroup.options,
    };
  }),
  ...fill.map((wordGroup) => {
    return {
      words: wordGroup.positions,
      collection_id: 2,
      name: wordGroup.name,
      description: wordGroup.description,
      options: wordGroup.options,
    };
  }),

  ...herf.map((wordGroup) => {
    return {
      words: wordGroup.positions,
      collection_id: 3,
      name: wordGroup.name,
      description: wordGroup.description,
      options: wordGroup.options,
    };
  }),
  ...prefix.map((wordGroup) => {
    return {
      words: wordGroup.positions,
      collection_id: 4,
      name: wordGroup.name,
      description: wordGroup.description,
      options: wordGroup.options,
    };
  }),
  ...suffix.map((wordGroup) => {
    return {
      words: wordGroup.positions,
      collection_id: 5,
      name: wordGroup.name,
      description: wordGroup.description,
      options: wordGroup.options,
    };
  }),
];
// await seed.collections(collections);
// await seed.wordGroups(wordGroups);
// Run it with: DRY=0 npx tsx seed.mts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ... you will write your Prisma Client queries here
  try {
    await prisma.collections.createMany({ data: collections });
    await prisma.word_groups.createMany({ data: wordGroups });
  } catch (error) {
    console.log(error);
  }
}
console.log("Seeding data...");
await main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
