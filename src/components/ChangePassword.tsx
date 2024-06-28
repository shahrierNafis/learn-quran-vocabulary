"use client";
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Auth } from "@supabase/auth-ui-react";
import { createClient } from "@/utils/supabase/clients";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Button } from "./ui/button";

export default function ChangePassword() {
  const supabase = createClient();
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"outline"}>Change Password</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>
            <Auth
              supabaseClient={supabase}
              view="update_password"
              appearance={{ theme: ThemeSupa }}
              theme="dark"
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
