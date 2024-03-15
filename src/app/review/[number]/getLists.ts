import getList from "@/utils/getList";

export default async function getLists(
  idArr: number[]
): Promise<{ [key: number]: `${string}:${string}:${string}`[][] }> {
  const lists: { [key: number]: `${string}:${string}:${string}`[][] } = {};
  for (const listId of idArr) {
    lists[listId] = (await getList(listId))
      .list as `${string}:${string}:${string}`[][];
  }
  return lists;
}
