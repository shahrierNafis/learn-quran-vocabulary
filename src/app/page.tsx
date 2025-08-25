"use client";
import Logout from "@/components/Logout";
import ParticlesEffect from "@/components/ui/ParticlesEffect";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { createClient } from "@/utils/supabase/clients";
import { Auth } from "@supabase/auth-ui-react";
import {
  // Import predefined theme
  ThemeSupa,
} from "@supabase/auth-ui-shared";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import ScrollDown from "@/components/ui/ScrollDown";
import UpdatePassword from "@/components/ChangePassword";
import Link from "@/components/ui/Link";
import React from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [user, setUser] = useState<User | null>();
  const supabase = createClient();
  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      setUser(data.user);
    });
    supabase.auth.onAuthStateChange((event, session) => {
      if (event == "SIGNED_IN") {
        supabase.auth.getUser().then(({ data, error }) => {
          setUser(data.user);
        });
      }
      setTimeout(async () => {
        // await on other Supabase function here
        // this runs right after the callback has finished
      }, 0);
    });
  }, [supabase.auth]);
  return (
    <>
      <ParticlesEffect />
      <div className="grid grid-rows-2 md:grid-cols-2 md:grid-rows-1 min-h-dvh">
        <div className="font-extrabold text-2xl p-8 text-justify content-center">
          Learn{" "}
          <span className="text-green-500 dark:text-green-300">
            Quranic Arabic
          </span>{" "}
          Faster And More Effectively Using{" "}
          <span className="text-green-500 dark:text-green-300">
            Spaced Repetition
          </span>{" "}
          And{" "}
          <span className="text-green-500 dark:text-green-300">
            Active Recall
          </span>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center min-h-dvh">
          {user === undefined ? (
            <LoadingScreen />
          ) : (
            <>
              {user === null ? (
                <Auth
                  supabaseClient={supabase}
                  appearance={{ theme: ThemeSupa }}
                  providers={["github"]}
                  theme="dark"
                  redirectTo="/dashboard"
                />
              ) : (
                <>
                  <div className="grid grid-cols-2 relative">
                    <div></div>{" "}
                    <div className="text-sm relative bottom-0 mt-auto mx-auto text-red-500 animate-pulse">
                      *new
                    </div>
                    <Link href={"/spacedRepetition"}>
                      <Button className="" variant={"outline"}>
                        Spaced Repetition
                      </Button>
                    </Link>
                    <Link
                      className="mx-auto animate-background-move block rounded-md bg-gradient-to-r from-green-300 via-white to-green-500 bg-[length:_400%_400%] p-px [animation-duration:_3s]"
                      href={"/activeRecall"}
                    >
                      <Button variant={"outline"}>
                        <div> Active Recall </div>
                      </Button>
                    </Link>
                  </div>
                  <UpdatePassword />
                  <Logout />
                </>
              )}
              <ScrollDown />
            </>
          )}
        </div>
      </div>
    </>
  );
}
