"use client";
import { Button } from "@/components/ui/button";
import Link from "@/components/ui/Link";
import React from "react";
import Preference from "./Preference";
import { usePathname } from "next/navigation";
import ReadQuranBtn from "./ReadQuranBtn";

export default function NavigationBar() {
  const pathname = usePathname();

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
        <ReadQuranBtn />
      </div>
    </>
  );
}
