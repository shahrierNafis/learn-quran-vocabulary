import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "@/components/ui/Link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown } from "lucide-react";

export default function ReadQuranBtn() {
  const pathname = usePathname();
  const num = pathname.split("/")[pathname.split("/").length - 1];
  return (
    <>
      <DropdownMenu>
        <Button asChild variant={"outline"} className="p-0 shadow-sm">
          <DropdownMenuTrigger className="px-6">
            <div className="flex items-center">
              {pathname.startsWith("/quran/surah") ? (
                <>
                  <div>{surahArr[+num - 1]}</div>
                </>
              ) : pathname.startsWith("/quran/juz") ? (
                <>juz {num}</>
              ) : (
                "Read Quran"
              )}

              <ChevronDown
                className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
                aria-hidden="true"
              />
            </div>
          </DropdownMenuTrigger>
        </Button>
        <DropdownMenuContent>
          <Tabs
            defaultValue={pathname.split("/")[2] == "juz" ? "juz" : "surah"}
            className="flex justify-center flex-col w-48"
          >
            <TabsList>
              <TabsTrigger value="surah">Surah</TabsTrigger>
              <TabsTrigger value="juz">Juz</TabsTrigger>
            </TabsList>
            <TabsContent value="surah">
              <ScrollArea className="h-[75vh]">
                {Array.from(Array(114).keys()).map((num) => {
                  return (
                    <Link
                      key={num + 1}
                      disabled={pathname == "/quran/surah/" + (num + 1)}
                      href={"/quran/surah/" + (num + 1)}
                      className={"w-full"}
                    >
                      <Button
                        disabled={pathname == "/quran/surah/" + (num + 1)}
                        className="grow flex gap-4 justify-start"
                        variant={"outline"}
                      >
                        <div>{num + 1}</div>
                        <div>{surahArr[num]}</div>
                      </Button>
                    </Link>
                  );
                })}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="juz">
              <ScrollArea className="h-[75vh]  grid grid-cols-1">
                {Array.from(Array(30).keys()).map((num) => {
                  return (
                    <Link
                      className={"w-full"}
                      key={num + 1}
                      disabled={pathname == "/quran/juz/" + (num + 1)}
                      href={"/quran/juz/" + (num + 1)}
                    >
                      <Button
                        disabled={pathname == "/quran/juz/" + (num + 1)}
                        className="grow flex gap-4 justify-center"
                        variant={"outline"}
                      >
                        <div>Juz</div> <div>{num + 1}</div>
                      </Button>
                    </Link>
                  );
                })}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
const surahArr = [
  "Al-Fatihah",
  "Al-Baqarah",
  "Ali 'Imran",
  "An-Nisa",
  "Al-Ma'idah",
  "Al-An'am",
  "Al-A'raf",
  "Al-Anfal",
  "At-Tawbah",
  "Yunus",
  "Hud",
  "Yusuf",
  "Ar-Ra'd",
  "Ibrahim",
  "Al-Hijr",
  "An-Nahl",
  "Al-Isra",
  "Al-Kahf",
  "Maryam",
  "Taha",
  "Al-Anbya",
  "Al-Hajj",
  "Al-Mu'minun",
  "An-Nur",
  "Al-Furqan",
  "Ash-Shu'ara",
  "An-Naml",
  "Al-Qasas",
  "Al-'Ankabut",
  "Ar-Rum",
  "Luqman",
  "As-Sajdah",
  "Al-Ahzab",
  "Saba",
  "Fatir",
  "Ya-Sin",
  "As-Saffat",
  "Sad",
  "Az-Zumar",
  "Ghafir",
  "Fussilat",
  "Ash-Shuraa",
  "Az-Zukhruf",
  "Ad-Dukhan",
  "Al-Jathiyah",
  "Al-Ahqaf",
  "Muhammad",
  "Al-Fath",
  "Al-Hujurat",
  "Qaf",
  "Adh-Dhariyat",
  "At-Tur",
  "An-Najm",
  "Al-Qamar",
  "Ar-Rahman",
  "Al-Waqi'ah",
  "Al-Hadid",
  "Al-Mujadila",
  "Al-Hashr",
  "Al-Mumtahanah",
  "As-Saf",
  "Al-Jumu'ah",
  "Al-Munafiqun",
  "At-Taghabun",
  "At-Talaq",
  "At-Tahrim",
  "Al-Mulk",
  "Al-Qalam",
  "Al-Haqqah",
  "Al-Ma'arij",
  "Nuh",
  "Al-Jinn",
  "Al-Muzzammil",
  "Al-Muddaththir",
  "Al-Qiyamah",
  "Al-Insan",
  "Al-Mursalat",
  "An-Naba",
  "An-Nazi'at",
  "'Abasa",
  "At-Takwir",
  "Al-Infitar",
  "Al-Mutaffifin",
  "Al-Inshiqaq",
  "Al-Buruj",
  "At-Tariq",
  "Al-A'la",
  "Al-Ghashiyah",
  "Al-Fajr",
  "Al-Balad",
  "Ash-Shams",
  "Al-Layl",
  "Ad-Duhaa",
  "Ash-Sharh",
  "At-Tin",
  "Al-'Alaq",
  "Al-Qadr",
  "Al-Bayyinah",
  "Az-Zalzalah",
  "Al-'Adiyat",
  "Al-Qari'ah",
  "At-Takathur",
  "Al-'Asr",
  "Al-Humazah",
  "Al-Fil",
  "Quraysh",
  "Al-Ma'un",
  "Al-Kawthar",
  "Al-Kafirun",
  "An-Nasr",
  "Al-Masad",
  "Al-Ikhlas",
  "Al-Falaq",
  "An-Nas",
];
