import Link from "next/link";
import React from "react";

export default function GotoDashboard() {
  return (
    <div className="border inline-block p-2">
      <Link href={"/dashboard"}>Goto Dashboard</Link>
    </div>
  );
}
