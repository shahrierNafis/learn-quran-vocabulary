"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@/utils/supabase/clients";
import { useEffect, useState } from "react";
export default function Home() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (!error && user) {
        window.location.href = "/dashboard";
      }
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      {isLoading ? (
        <></>
      ) : (
        <Auth
          supabaseClient={supabase}
          view="magic_link"
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          showLinks={false}
          providers={[]}
          redirectTo="http://localhost:3000/auth/callback"
        />
      )}
    </>
  );
}
