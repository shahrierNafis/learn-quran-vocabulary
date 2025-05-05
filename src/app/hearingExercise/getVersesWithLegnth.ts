"use server";
const inverseWordCount: {
  [key: number]: string[];
} = require("../../inverseWordCount.json");
export default async function getVersesWithLength(length: number) {
  return inverseWordCount[length];
}
