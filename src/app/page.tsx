"use client";
import GotoDashboard from "@/components/GotoDashboard";
import Logout from "@/components/Logout";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { createClient } from "@/utils/supabase/clients";
import { Auth } from "@supabase/auth-ui-react";
import {
  // Import predefined theme
  ThemeSupa,
} from "@supabase/auth-ui-shared";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
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
      <div className="flex flex-col gap-2 justify-center items-center min-h-dvh">
        {user === undefined ? (
          <LoadingScreen />
        ) : user === null ? (
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
      </div>
    </>
  );
}
