import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
const formSchema = z.object({
  email: z.string().email(),
});
import React, { Dispatch, SetStateAction } from "react";
import { createClient } from "@/utils/supabase/clients";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
function SendOTP({
  setIsSent,
  setEmail,
}: {
  setIsSent: Dispatch<SetStateAction<boolean>>;
  setEmail: Dispatch<SetStateAction<string>>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const supabase = createClient();

  async function handleSendOTP(values: z.infer<typeof formSchema>) {
    const { error } = await supabase.auth.signInWithOtp({
      email: values.email,
    });
    if (!error) {
      setEmail(values.email);
      setIsSent(true);
    }
  }

  return (
    <>
      {" "}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSendOTP)} className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="mx-auto block" type="submit">
            Send OTP
          </Button>
        </form>
      </Form>
    </>
  );
}

export default SendOTP;

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
