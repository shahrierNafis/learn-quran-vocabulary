"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@/utils/supabase/clients";
import { use } from "react";
export default function Home() {
  const supabase = createClient();
  const { data, error } = use(supabase.auth.getUser());
  if (!error && data?.user) {
    window.location.href = "/dashboard";
  } else {
    return (
      <>
        <Auth
          supabaseClient={supabase}
          view="magic_link"
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          showLinks={false}
          providers={[]}
          redirectTo="http://localhost:3000/auth/callback"
        />
      </>
    );
  }
}
