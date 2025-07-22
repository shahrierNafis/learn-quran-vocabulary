import { Tables } from "@/database.types";
import { useOnlineStorage } from "@/stores/onlineStorage";

export default function getInterval(percentage: number) {
  const intervals = useOnlineStorage.getState().intervals;
  Object.keys(intervals).sort((a, b) => +b - +a);
  for (const step of Object.keys(intervals)) {
    if (+step >= percentage) {
      return intervals[+step];
    }
  }
  return 0;
}
