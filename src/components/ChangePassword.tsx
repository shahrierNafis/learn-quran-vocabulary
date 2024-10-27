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
import { Button, buttonVariants } from "./ui/button";

export default function ChangePassword() {
  const supabase = createClient();
  return (
    <Dialog>
      <DialogTrigger>
        <div className={buttonVariants({ variant: "outline" })}>
          Change Password
        </div>
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
