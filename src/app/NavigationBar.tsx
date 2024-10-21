"use client";
import { Button } from "@/components/ui/button";
import Link from "@/components/ui/Link";
import React, { useEffect, useState } from "react";
import Preference from "./Preference";
import { usePathname } from "next/navigation";
import ReadQuranBtn from "./ReadQuranBtn";
import { createClient } from "@/utils/supabase/clients";
import BuyMeACoffeeDialog from "./BuyMeACoffeeDialog";

export default function NavigationBar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = createClient();
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (user) setIsLoggedIn(true);
    });

    return () => {};
  }, [supabase.auth]);

  return (
    <>
      <div className="flex mx-auto items-center justify-center flex-wrap">
        <div className="">
          <Link href="/" disabled={pathname == "/"}>
            <Button disabled={pathname == "/"} variant={"outline"}>
              home
            </Button>
          </Link>
        </div>
        {isLoggedIn && (
          <div>
            <Link href="/dashboard" disabled={pathname == "/dashboard"}>
              <Button disabled={pathname == "/dashboard"} variant={"outline"}>
                Dashboard
              </Button>
            </Link>
          </div>
        )}
        <Preference />
        <ReadQuranBtn />
        <BuyMeACoffeeDialog />
      </div>
    </>
  );
}
