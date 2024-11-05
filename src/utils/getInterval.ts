import { Tables } from "@/database.types";
import { usePreferenceStore } from "@/stores/preference-store";

export default function getInterval(percentage: number) {
  const intervals = usePreferenceStore.getState().intervals;
  Object.keys(intervals).sort((a, b) => +b - +a);
  for (const step of Object.keys(intervals)) {
    if (+step >= percentage) {
      return intervals[+step];
    }
  }
  return 0;
}
