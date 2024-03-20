import { Tables } from "@/database.types";
import Link from "next/link";
import React from "react";
import PlayBtn from "@/components/PlayBtn";
import { Button } from "./ui/button";
export default function Collection({
  collection,
}: {
  collection: Tables<"collections">;
}) {
  return (
    <>
      <div className="flex items-center min-w-screen max-w-screen-lg mx-auto">
        <div className="text-3xl hidden md:block">‣</div>
        <div className="p-2 flex items-center m-2 border border-input bg-background justify-around flex-grow">
          <div className="max-w-screen-md">
            <h1 className="text-2xl">{collection.name}</h1>
            <p className="">{collection.description}</p>
          </div>
          <div className="flex gap-2 flex-col md:flex-row">
            <Button size={"sm"}>
              <Link href={`/collection/${collection.id}`}>Manage</Link>
            </Button>
            <PlayBtn id={"" + collection.id} />
          </div>
        </div>
      </div>
    </>
  );
}
