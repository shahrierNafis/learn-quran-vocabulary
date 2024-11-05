import { Database, Tables } from "@/database.types";
import { createClient } from "./supabase/clients";
import getToReviewIds from "./getToReviewIds";
import sortProgresses from "./sortProgresses";

export default async function getToReview(
  collection_id?: number
): Promise<Tables<"word_groups">[]> {
  const supabase = createClient<Database>();
  const progresses = collection_id
    ? await supabase
        .from("user_progress")
        .select("*,word_groups(collection_id)")

        // get only the wordGroups in collection if specified

        //get all the wordGroups in collection

        .then(({ data, error }) => {
          if (error) {
            console.log(error);
          } else {
            return data.filter(
              (d) => d.word_groups?.collection_id == collection_id
            );
          }
          return [];
        })
    : await supabase // else get all
        .from("user_progress")
        .select("*")
        .then(({ data, error }) => {
          if (error) {
            console.log(error);
          } else {
            return data;
          }
          return [];
        });
  const toReview: number[] = await getToReviewIds(sortProgresses(progresses));
  const wordGroups = await supabase
    .from("word_groups")
    .select("*")
    .in("id", toReview)
    .then(({ data, error }) => {
      if (error) {
        console.log(error);
      } else {
        return data;
      }
      return [];
    });

  return toReview
    .map((id) => {
      for (const wordGroup of wordGroups) {
        if (wordGroup.id == id) {
          return wordGroup;
        }
      }
    })
    .filter((a) => !!a);
}
