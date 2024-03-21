import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

export default function GotoDashboard() {
  return (
    <>
      <Button variant={"outline"}>
        <Link href={"/dashboard"}>Goto Dashboard</Link>
      </Button>
    </>
  );
}
