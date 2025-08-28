import { useOnlineStorage } from "@/stores/onlineStorage";
import { IPreview, Rating, RatingType, RecordLogItem, fsrs } from "ts-fsrs";
export const preconfiguredFsrs = fsrs({ maximum_interval: useOnlineStorage.getState().maximumInterval });
