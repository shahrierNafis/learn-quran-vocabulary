"use client";
import { createClient } from "@/utils/supabase/clients";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import LoadingScreen from "./ui/LoadingScreen";
export default function CheckAuth() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error && !user && !["/"].includes(pathname)) {
        alert(error.message);
        window.location.href = "/";
      }
      setIsLoading(false);
    });

    return () => {};
  }, [pathname, supabase.auth]);
  if (isLoading) {
    return <LoadingScreen />;
  }
  return <></>;
}
