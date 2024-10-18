"use client";
import { Button } from "@/components/ui/button";
import Link from "@/components/ui/Link";
import React from "react";
import Preference from "./Preference";
import { usePathname } from "next/navigation";

export default function NavigationBar() {
  const pathname = usePathname();
  console.log(pathname);

  return (
    <>
      <div className="flex mx-auto items-center justify-center">
        <div className="">
          <Link href="/" disabled={pathname == "/"}>
            <Button disabled={pathname == "/"} variant={"outline"}>
              home
            </Button>
          </Link>
        </div>
        <div>
          <Link href="/dashboard" disabled={pathname == "/dashboard"}>
            <Button disabled={pathname == "/dashboard"} variant={"outline"}>
              Dashboard
            </Button>
          </Link>
        </div>
        <div>
          <Preference />
        </div>
        <div>
          <Link href="/quran/1" disabled={pathname.startsWith("/quran")}>
            <Button
              disabled={pathname.startsWith("/quran")}
              variant={"outline"}
            >
              Read Quran
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
