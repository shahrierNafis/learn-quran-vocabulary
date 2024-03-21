"use client";
import GotoDashboard from "@/components/GotoDashboard";
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
6;
export default function Home() {
  const [user, setUser] = useState<User | null>();
  const supabase = createClient();
  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      setUser(data.user);
    });
  }, [supabase.auth]);
  return (
    <>
      <ParticlesEffect />
      <div className="grid grid-rows-2 md:grid-cols-2 md:grid-rows-1 min-h-dvh">
        <div
          // style={{ backgroundImage: 'url("/image2.jpg")' }}
          className="grid place-content-center bg-cover bg-right bg-no-repeat"
        >
          <div className=" text-5xl md:text-6xl font-bold text-center">
            <div className="inline text-green-400 dark:text-green-300">
              Learn Quranic Arabic
            </div>{" "}
            Faster And More Effectively Using Cloze Testing And Spaced
            Repetition
          </div>
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
                  providers={["google", "github"]}
                  onlyThirdPartyProviders
                  theme="dark"
                  redirectTo="/dashboard"
                />
              ) : (
                <>
                  <GotoDashboard />
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
