import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "@/components/ui/Link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReadQuranBtn() {
  const pathname = usePathname();
  const num = pathname.split("/")[pathname.split("/").length - 1];
  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Button variant={"outline"} className="p-0 shadow-sm">
              <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
                <div>
                  <Link
                    href="/quran/surah/1"
                    disabled={pathname.startsWith("/quran")}
                  >
                    {pathname.startsWith("/quran/surah") ? (
                      <>
                        <div>{surahArr[+num - 1]}</div>
                      </>
                    ) : pathname.startsWith("/quran/juz") ? (
                      <>juz {num}</>
                    ) : (
                      "Read Quran"
                    )}
                  </Link>
                </div>
              </NavigationMenuTrigger>
            </Button>
            <NavigationMenuContent>
              <Tabs
                defaultValue={pathname.split("/")[2] == "juz" ? "juz" : "surah"}
                className="flex justify-center flex-col w-48"
              >
                <TabsList>
                  <TabsTrigger value="surah">Surah</TabsTrigger>
                  <TabsTrigger value="juz">Juz</TabsTrigger>
                </TabsList>
                <TabsContent value="surah">
                  <div className="max-h-[75vh] overflow-y-auto flex flex-col">
                    {Array.from(Array(114).keys()).map((num) => {
                      return (
                        <>
                          <NavigationMenuLink asChild>
                            <Link
                              disabled={pathname == "/quran/surah/" + (num + 1)}
                              href={"/quran/surah/" + (num + 1)}
                              className={"justify-center"}
                            >
                              <Button
                                disabled={
                                  pathname == "/quran/surah/" + (num + 1)
                                }
                                className="grow flex gap-4 justify-start"
                                variant={"outline"}
                              >
                                <div>{num + 1}</div>
                                <div>{surahArr[num]}</div>
                              </Button>
                            </Link>
                          </NavigationMenuLink>
                        </>
                      );
                    })}
                  </div>
                </TabsContent>
                <TabsContent value="juz">
                  <div className="max-h-[75vh] overflow-y-auto flex flex-col">
                    {Array.from(Array(30).keys()).map((num) => {
                      return (
                        <>
                          <NavigationMenuLink asChild>
                            <Link
                              disabled={pathname == "/quran/surah/" + (num + 1)}
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
                          </NavigationMenuLink>
                        </>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
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
