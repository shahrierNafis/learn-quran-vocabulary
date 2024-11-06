import getInterval from "./getInterval";

export default async function getToReviewIds(
  progresses: { progress: number; word_group_id: number; updated_at: string }[]
) {
  const toReview: number[] = [];
  for (const { progress, word_group_id, updated_at } of progresses) {
    const interval = getInterval(progress);
    const dueDate = new Date(new Date(updated_at).getTime() + interval);
    dueDate.setHours(0, 0, 0, 0);
    const current = new Date();
    current.setHours(0, 0, 0, 0);
    if (dueDate.getTime() <= current.getTime()) {
      toReview.push(+word_group_id);
    }
  }
  return toReview;
}
