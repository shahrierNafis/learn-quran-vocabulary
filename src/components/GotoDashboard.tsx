import Link from "@/components/ui/Link";
import React from "react";
import { Button } from "./ui/button";

export default function GotoDashboard({
  variant,
}: {
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
}) {
  return (
    <>
      <Link href={"/dashboard"}>
        <Button variant={variant ?? "outline"}>Goto Dashboard</Button>
      </Link>
    </>
  );
}
