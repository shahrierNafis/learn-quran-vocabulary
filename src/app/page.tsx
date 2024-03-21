"use client";
import { createClient } from "@/utils/supabase/clients";
import { Auth } from "@supabase/auth-ui-react";
import {
  // Import predefined theme
  ThemeSupa,
} from "@supabase/auth-ui-shared";
6;
export default function Home() {
  const supabase = createClient();

  return (
    <>
      <div className="flex justify-center items-center min-h-dvh">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={["google", "github"]}
          onlyThirdPartyProviders
          theme="dark"
          redirectTo="/auth/confirm"
        />
      </div>
    </>
  );
}
