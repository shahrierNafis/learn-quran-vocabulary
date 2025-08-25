import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { useOnlineStorage } from "@/stores/onlineStorage"; import { useShallow } from "zustand/react/shallow";



export default function IntervalPresets() {
    const [intervals, setAllIntervals] = useOnlineStorage(useShallow((state) => [state.intervals, state.setAllIntervals]));

    return (<>      <AlertDialog>
        <AlertDialogTrigger className="flex">
            <Button>Presets</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Presets</AlertDialogTitle>
                <AlertDialogDescription></AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex font-bold gap-4 justify-center">
                {Object.keys(presets).map((i) =>
                (<Button variant={(Object.keys(intervals).length === Object.keys(presets[i]).length &&
                    Object.keys(intervals).every(key => intervals[+key] === presets[i][+key])) ? "default" : "outline"} className={"font-mono font-extrabold"} onClick={() => setAllIntervals(presets[i])}>{i}</Button>))}
            </div>
            <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>)
}

const presets: { [key: string]: { [key: number]: number } } = {
    "5 percent": {
        5: 0,
        10: 0,
        15: 0,
        20: 0,
        25: 86400000,
        30: 0,
        35: 0,
        40: 0,
        45: 0,
        50: 864000000,
        60: 0,
        65: 0,
        70: 0,
        75: 2592000000,
        80: 0,
        85: 0,
        90: 0,
        95: 0,
        100: 15552000000,
    },
    "10 percent": {
        10: 0,
        25: 86400000,
        30: 0,
        40: 0,
        50: 864000000,
        60: 0,
        75: 2592000000,
        70: 0,
        80: 0,
        100: 15552000000,
    },
    default: {
        25: 86400000,
        50: 864000000,
        75: 2592000000,
        100: 15552000000,
    }
}