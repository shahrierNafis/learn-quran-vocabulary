import { Tables } from "@/database.types";
import Link from "@/components/ui/Link";
import React from "react";
import PlayBtn from "@/components/PlayBtn";
import { Button } from "./ui/button";
import CollectionProgress from "./CollectionProgress";
import ReviewBtn from "./ReviewBtn";
export default function Collection({
  collection,
}: {
  collection: Tables<"collections">;
}) {
  return (
    <>
      <div className="flex items-center min-w-screen max-w-screen-lg mx-auto">
        <div className="text-3xl hidden md:block">‣</div>
        <div className="p-2 flex m-2 border border-input bg-background justify-around flex-grow">
          <div className="max-w-screen-md">
            <h1 className="text-2xl">{collection.name}</h1>
            <p className="">{collection.description}</p>
          </div>
          <div className="flex grow space-y-2 my-auto flex-col justify-center items-center">
            <CollectionProgress collection_id={collection.id} />
            <div className="flex md:space-x-2 md:space-y-0 space-y-2 flex-col md:flex-row">
              <Link className="flex" href={`/collection/${collection.id}`}>
                <Button className="grow" size={"sm"}>
                  Manage{" "}
                </Button>
              </Link>

              <PlayBtn {...{ collection_id: collection.id }} />
              <ReviewBtn {...{ collection_id: collection.id }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
