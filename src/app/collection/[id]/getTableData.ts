import { Json } from "@/database.types";
import { TableData } from "./columns";
import { Progress } from "@/utils/getProgress";

export default async function getData(collection: Json, progress: Progress) {
  const data = (await Promise.all(
    (collection as string[][]).map(async (group, index) => {
      return {
        index: group[0],

        subRows: (await Promise.all(
          group.slice(1).map(async (z) => {
            return { index: z };
          })
        )) as TableData[],
        progress: (progress as Progress)[index]?.percentage ?? 0,
        updatedOn: (progress as Progress)[index]?.updatedOn,
      };
    })
  )) as TableData[];
  return data;
}
