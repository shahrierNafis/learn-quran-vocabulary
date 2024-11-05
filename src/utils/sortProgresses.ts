import { Tables } from "@/database.types";
import { usePreferenceStore } from "@/stores/preference-store";
import getInterval from "./getInterval";
export default function sortProgresses(progresses: Tables<"user_progress">[]) {
  const reviewOrder = usePreferenceStore.getState().reviewOrder;
  switch (reviewOrder) {
    case "level ASC":
      return progresses.toSorted((a, b) => a.progress - b.progress);
    case "level DESC":
      return progresses.toSorted((a, b) => b.progress - a.progress);
    case "next_review ASC":
      return progresses.toSorted((a, b) => {
        const current = new Date().getTime();
        const dueDateA =
          current - new Date(a.updated_at).getTime() + getInterval(a.progress);
        const dueDateB =
          current - new Date(b.updated_at).getTime() + getInterval(b.progress);
        return dueDateB - dueDateA;
      });
    case "next_review DESC":
      return progresses.toSorted((a, b) => {
        const current = new Date().getTime();
        const dueDateA =
          current - new Date(a.updated_at).getTime() + getInterval(a.progress);
        const dueDateB =
          current - new Date(b.updated_at).getTime() + getInterval(b.progress);
        return dueDateA - dueDateB;
      });

    case "random":
      return progresses.toSorted(() => 0.5 - Math.random());
    default:
      return progresses;
  }
}
