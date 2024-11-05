import getInterval from "./getInterval";

export default async function getToReviewIds(
  progresses: { progress: number; word_group_id: number; updated_at: string }[]
) {
  const toReview: number[] = [];
  for (const { progress, word_group_id, updated_at } of progresses) {
    const interval = getInterval(progress);
    const updatedOn = new Date(updated_at).getTime();
    const current = new Date().getTime();
    if (updatedOn + interval < current) {
      toReview.push(+word_group_id);
    }
  }
  return toReview;
}
