import { Tables } from "@/database.types";
import Link from "next/link";
import React from "react";

export default function Collection({
  collection,
}: {
  collection: Tables<"collections">;
}) {
  return (
    <>
      <div className="flex items-center">
        <div className="text-3xl">‣</div>
        <div className="p-2 inline-block w-full m-2 cursor-pointer border border-input bg-background hover:bg-accent hover:text-accent-foreground">
          <Link href={`/collection/${collection.id}`}> {collection.name}</Link>
        </div>
      </div>
    </>
  );
}
