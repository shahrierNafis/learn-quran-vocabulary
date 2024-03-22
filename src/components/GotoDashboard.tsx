import Link from "@/components/ui/Link";
import React from "react";
import { Button } from "./ui/button";

export default function GotoDashboard() {
  return (
    <>
      <Link href={"/dashboard"}>
        <Button variant={"outline"}>Goto Dashboard</Button>
      </Link>
    </>
  );
}
