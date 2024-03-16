import getCollection from "@/utils/getCollection";

export default async function getCollections(
  idArr: number[]
): Promise<{ [key: number]: `${string}:${string}:${string}`[][] }> {
  const collections: { [key: number]: `${string}:${string}:${string}`[][] } =
    {};
  for (const collectionId of idArr) {
    collections[collectionId] = (await getCollection(collectionId))
      .collection as `${string}:${string}:${string}`[][];
  }
  return collections;
}
