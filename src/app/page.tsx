"use client";

import { createClient } from "@/utils/supabase/clients";
import { useEffect, useState } from "react";

import { OTPInput } from "input-otp";
import SendOTP from "@/components/SendOTP";
import Slot from "@/components/ui/Slot";

export default function Home() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isSent, setIsSent] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (!error && user) {
        window.location.href = "/dashboard";
      }
      setIsLoading(false);
    });
  }, []);

  function handleOTPInput(token: any) {
    supabase.auth
      .verifyOtp({ email, token, type: "email" })
      .then(({ error }) => {
        if (error) {
          alert(error.message);
        } else {
          window.location.href = "/dashboard";
        }
      });
  }

  return (
    <>
      <div className="flex flex-col w-full h-[100dvh] justify-center items-center gap-2">
        {isLoading ? (
          <></>
        ) : !isSent ? (
          <>
            <SendOTP {...{ setIsSent, setEmail }} />
          </>
        ) : (
          <>
            <OTPInput
              onComplete={handleOTPInput}
              maxLength={6}
              containerClassName="group flex items-center has-[:disabled]:opacity-30"
              render={({ slots }) => (
                <div className="flex flex-col">
                  <div className="text-xl block font-bold">Enter OTP:</div>
                  <div className="flex">
                    {slots.map((slot, idx) => (
                      <Slot key={idx} {...slot} />
                    ))}
                  </div>
                </div>
              )}
            />
          </>
        )}
      </div>
    </>
  );
}
